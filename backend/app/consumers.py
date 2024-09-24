import json
import threading
import paho.mqtt.client as paho
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from .models import Sensor, DeviceStatus
import asyncio
from asgiref.sync import sync_to_async

# Callback functions for MQTT
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"CONNACK received with code {rc}.")

def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    print(f"Subscribed: {mid} {granted_qos}")

def on_publish(client, userdata, mid, properties=None):
    print(f"mid: {mid}")

async def save_device_status(action):
    now = timezone.now()
    device_status = DeviceStatus(
        action=action,
        time=now
    )
    await sync_to_async(device_status.save)()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # MQTT client setup
        self.client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
        self.client.on_connect = on_connect
        self.client.tls_set(tls_version=paho.ssl.PROTOCOL_TLS)
        self.client.connect('test.mosquitto.org', 1883)
        self.client.on_subscribe = on_subscribe
        self.client.on_publish = on_publish

        # WebSocket setup
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

        # Start MQTT loop
        self.client.loop_start()

        self.client.on_message = self.on_message

    async def on_message(self, client, userdata, msg):
        data_string = msg.payload.decode('utf-8')
        data = json.loads(data_string)
        
        temperature = data.get("temperature")
        humidity = data.get("humidity")
        light = data.get("light")
        now = timezone.now()
        
        # Save data to database
        await sync_to_async(Sensor.objects.create)(
            temperature=str(temperature),
            humidity=str(humidity),
            light=str(light),
            time=now
        )
        print(data_string)

        # Prepare and send WebSocket message
        message = {
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'light': data['light'],
            'time': now.strftime('%Y-%m-%d %H:%M:%S')
        }
        await self.send(text_data=json.dumps({'message': message}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )
        self.client.loop_stop()
        self.client.disconnect()

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Publish control message based on received data
        if message in ['fan_on', 'fan_off', 'air_on', 'air_off', 'lamp_on', 'lamp_off']:
            topic_map = {
                'fan_on': 'iot/fan',
                'fan_off': 'iot/fan',
                'air_on': 'iot/air',
                'air_off': 'iot/air',
                'lamp_on': 'iot/lamp',
                'lamp_off': 'iot/lamp'
            }
            payload = 'on' if 'on' in message else 'off'
            topic = topic_map[message]
            self.client.publish(topic, payload, qos=1)

            # Save device status to database
            await save_device_status(message)

        # Notify WebSocket group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

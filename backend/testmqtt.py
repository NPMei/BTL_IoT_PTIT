import paho.mqtt.client as paho
import json
from datetime import datetime

class MQTTClient:
    def __init__(self, broker='test.mosquitto.org', port=1883):
        self.client = paho.Client()
        self.client.on_publish = self.on_publish
        self.client.on_message = self.on_message
        self.broker = broker
        self.port = port
        self.curent_data = {}

    def on_publish(self, client, userdata, mid):
        print(f"Message published with mid: {mid}")

    def on_message(self, client, userdata, msg):
        # Giải mã payload và xử lý dữ liệu nhận được
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            self.curent_data=payload
        except json.JSONDecodeError:
            print("Received non-JSON data")

    def connect(self):
        # Kết nối tới broker
        self.client.connect(self.broker, self.port)
        self.client.loop_start()  # Bắt đầu vòng lặp mạng để nhận dữ liệu

    def subscribe(self, topic):
        # Subscribe vào topic
        self.client.subscribe(topic)
        print(f"Subscribed to '{topic}' topic")

    def control_device(self, device, state):
        topic = {
            'fan': 'iot/fan',
            'air': 'iot/air',
            'lamp': 'iot/lamp'
        }.get(device)

        if topic:
            payload = 'on' if state else 'off'
            self.client.publish(topic, payload, qos=1)
            print(f"Sent command to {device}: {payload}")

    def disconnect(self):
        # Dừng vòng lặp mạng và ngắt kết nối
        self.client.loop_stop()
        self.client.disconnect()


# Sử dụng module này để nhận dữ liệu từ topic
# if __name__ == "__main__":
#     mqtt_client = MQTTClient()
#     mqtt_client.connect()
    
#     # Subscribe vào topic sensor/datas
#     mqtt_client.subscribe('sensor/datas')

#     # Đợi một khoảng thời gian để nhận dữ liệu
#     import time
#     time.sleep(10)  # Chờ 10 giây để nhận dữ liệu

#     # Lấy dữ liệu đã nhận
#     received_data = mqtt_client.get_received_data()
#     print(f"Latest received data: {received_data}")

#     # Ngắt kết nối
#     mqtt_client.disconnect()

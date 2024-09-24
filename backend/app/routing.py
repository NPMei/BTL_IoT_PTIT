from django.urls import re_path
from .consumers import ChatConsumer

import asyncio







# import time
# import threading
# import paho.mqtt.client as paho
# from paho import mqtt

# # setting callbacks for different events to see if it works, print the message etc.
# def on_connect(client, userdata, flags, rc, properties=None):
#     print("CONNACK received with code %s." % rc)

# # with this callback you can see if your publish was successful
# def on_publish(client, userdata, mid, properties=None):
#     print("mid: " + str(mid))

# # print which topic was subscribed to
# def on_subscribe(client, userdata, mid, granted_qos, properties=None):
#     print("Subscribed: " + str(mid) + " " + str(granted_qos))


# # print message, useful for checking if it was successful
# def on_message(client, userdata, msg):
#     # print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))

#     print((str(msg.payload)))


# client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
# client.on_connect = on_connect

# # enable TLS for secure connection
# client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
# # set username and password
# client.username_pw_set("django", "Thang123456")
# # connect to HiveMQ Cloud on port 8883 (default for MQTT)
# client.connect("a612099c8cef47249fb4fc1f7cbcb44e.s2.eu.hivemq.cloud", 8883)

# # # setting callbacks, use separate functions like above for better visibility
# client.on_subscribe = on_subscribe
# client.on_message = on_message
# client.on_publish = on_publish

# # # subscribe to all topics of encyclopedia by using the wildcard "#"
# client.subscribe("nam", qos=1)



# # # a single publish, this can also be done in loops, etc.
# client.publish("thang", payload="nong", qos=1)


# # client.loop_forever()

# def mqtt_loop(client):
#     while True:
#         try:
#             client.loop_forever()
#         except Exception as e:
#             print(f"MQTT Loop Exception: {e}")
#             time.sleep(1)  # Wait before retrying


# def start_mqtt_thread(client):
#     mqtt_thread = threading.Thread(target=mqtt_loop, args=(client,))
#     mqtt_thread.start()
#     return mqtt_thread


# mqtt_thread = start_mqtt_thread(client)


websocket_urlpatterns = [
        # re_path('ws/chat/', consumers.ChatConsumer.as_asgi()),
        re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),

]
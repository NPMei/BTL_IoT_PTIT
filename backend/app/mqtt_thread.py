# mqtt_thread.py
from testmqtt import MQTTClient
import time
import threading
# from .views import mqtt_update_data  # Import hàm cập nhật dữ liệu

def run_mqtt_client():
    from .views import mqtt_update_data
    # Khởi tạo MQTTClient
    mqtt_client = MQTTClient()

    # Kết nối và subscribe vào topic 'sensor/datas'
    mqtt_client.connect()
    mqtt_client.subscribe('sensor/datas')

    # Chạy vòng lặp để kiểm tra dữ liệu nhận được
    try:
        while True:
            received_data = mqtt_client.curent_data
            if received_data:  # Kiểm tra xem có dữ liệu mới hay không
                mqtt_update_data(received_data)  # Cập nhật dữ liệu vào biến toàn cục
            time.sleep(1)  # Đợi 1 giây trước khi kiểm tra lại
    except KeyboardInterrupt:
        print("Terminating...")
    finally:
        mqtt_client.disconnect()
def start_mqtt_thread():
    
    mqtt_thread = threading.Thread(target=run_mqtt_client)
    mqtt_thread.daemon = True  # Để dừng thread khi server Django dừng
    mqtt_thread.start()

def run_mqtt_client_for_device():
    """Chạy client để nhận dữ liệu từ topic iot/device/status"""
    from .views import mqtt_update_data_for_device
    mqtt_client = MQTTClient()

    # Kết nối và subscribe vào topic 'iot/device/status'
    mqtt_client.connect()
    mqtt_client.subscribe('iot/device/status')

    # Chạy vòng lặp để kiểm tra dữ liệu nhận được
    try:
        while True:
            received_data = mqtt_client.curent_data
            if received_data:  # Kiểm tra xem có dữ liệu mới hay không
                mqtt_update_data_for_device(received_data)  # Cập nhật dữ liệu vào biến toàn cục
            time.sleep(1)
    except KeyboardInterrupt:
        print("Terminating...")
    finally:
        mqtt_client.disconnect()

# Hàm để khởi chạy thread MQTT cho thiết bị
def start_device_thread():
    mqtt_thread_2 = threading.Thread(target=run_mqtt_client_for_device)
    mqtt_thread_2.daemon = True
    mqtt_thread_2.start()

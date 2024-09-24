from django.apps import AppConfig
from .mqtt_thread import start_mqtt_thread  # Import hàm khởi động thread MQTT


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
    def ready(self):
        # Khởi động MQTT client khi Django server bắt đầu
        start_mqtt_thread()

from django.urls import path
from . import views

urlpatterns = [
    path('api/sensor-data/', views.sensor_data_list, name='sensor_data_list'),
    path('api/device-data/',views.device_data_list, name='device_data_list'),
    path('api/mqtt-data/', views.get_mqtt_data, name='get_mqtt_data'),
    path('api/change-device/',views.change_device,name='change_device')
]

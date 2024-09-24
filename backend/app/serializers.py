from rest_framework import serializers
from .models import Sensor, Device

class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ['id','temperature', 'humidity', 'light', 'time']
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id','device', 'status', 'time']

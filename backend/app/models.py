from typing import Any
from django.db import models

# Create your models here.



from django.db import models

class Sensor(models.Model):
    id = models.IntegerField(primary_key=True)
    temperature = models.FloatField()  # Thay CharField bằng FloatField
    humidity = models.FloatField()     # Thay CharField bằng FloatField
    light = models.IntegerField()      # Thay CharField bằng IntegerField
    time = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Id:{self.id}, Temperature: {self.temperature}, Humidity: {self.humidity}, Light: {self.light}"
class Device(models.Model):
    id = models.IntegerField(primary_key=True)
    time = models.DateTimeField(auto_now_add=True)
    device = models.TextField()
    status = models.IntegerField()
    def __str__(self):
        return f"Id:{self.id}, Timestamp:{self.time}, Device:{self.device}, Status:{self.device}"

    # def __str__(self):
    #     return self.name
from django.db import models

class DeviceStatus(models.Model):
    id = models.IntegerField(primary_key=True)
    action = models.CharField(max_length=255)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Id:{self.id}, Action: {self.action}, Time: {self.time}"


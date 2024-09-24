from django.contrib import admin
from .models import Sensor, DeviceStatus

class SensorAdmin(admin.ModelAdmin):
    readonly_fields = ('temperature', 'humidity', 'light', 'time')
    list_display = ('temperature', 'humidity', 'light', 'time') 
    sortable_by = ('time', )

admin.site.register(Sensor, SensorAdmin)

class DeviceStatusAdmin(admin.ModelAdmin):
    readonly_fields = ('action', 'time')
    list_display = ('id', 'action', 'time')
    ordering = ('-time', )  # Sắp xếp theo thời gian giảm dần
    def __str__(self):
        return f"Action: {self.action} at {self.time}"

admin.site.register(DeviceStatus, DeviceStatusAdmin)

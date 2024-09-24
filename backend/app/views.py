from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Sensor, Device
from .serializers import SensorSerializer,DeviceSerializer
from django.utils.dateparse import parse_datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@api_view(['GET'])
def sensor_data_list(request):
    try:
        # Lấy giá trị từ request query parameters
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        orderby = request.query_params.get('orderby')
        rowsperpage = request.query_params.get('rowsperpage')
        page = request.query_params.get('page')
        revSort = request.query_params.get('revsort', 'false').lower() == 'true'  # Chuyển đổi thành boolean
        filTemp = request.query_params.get('searchTemp')
        filHumidity = request.query_params.get('searchHumidity')
        filLight = request.query_params.get('searchLight')

        # Chuyển đổi giá trị của start và end thành kiểu datetime
        start_datetime = parse_datetime(start) if start else None
        end_datetime = parse_datetime(end) if end else None
        rows_per_page = int(rowsperpage) if rowsperpage else 10  # Mặc định là 10 nếu không có rowsperpage
        current_page = int(page) if page else 0  # Mặc định là trang 0 nếu không có page

        # Lọc dữ liệu theo khoảng thời gian (nếu có)
        if start_datetime and end_datetime:
            sensor_data = Sensor.objects.filter(time__range=[start_datetime, end_datetime])
        elif start_datetime:
            sensor_data = Sensor.objects.filter(time__gte=start_datetime)
        elif end_datetime:
            sensor_data = Sensor.objects.filter(time__lte=end_datetime)
        else:
            sensor_data = Sensor.objects.all()
        
        # Lọc dữ liệu theo temperature, humidity và light (nếu có)
        if filTemp !='undefined':
            sensor_data = sensor_data.filter(temperature=float(filTemp))
        if filHumidity !='undefined':
            sensor_data = sensor_data.filter(humidity=float(filHumidity))
        if 'undefined' not in filLight:
            sensor_data = sensor_data.filter(light=int(filLight))

        # Sắp xếp dữ liệu theo biến orderby
        valid_orderby_fields = ['id', 'temperature', 'humidity', 'light', 'time']
        if orderby not in valid_orderby_fields:
            return Response({'error': 'Invalid orderby parameter'}, status=status.HTTP_400_BAD_REQUEST)

        # Phân trang dữ liệu
        start_index = current_page * rows_per_page
        end_index = start_index + rows_per_page

        # Chuyển queryset thành list và cắt dữ liệu cho trang hiện tại
        sensor_data_list = list(sensor_data)
        sensor_data_list.sort(key=lambda x: getattr(x, 'time'),reverse=True)
        paginated_data = sensor_data_list[start_index:end_index]

        # Sắp xếp dữ liệu
        paginated_data.sort(key=lambda x: getattr(x, orderby))

        # Đảo ngược dữ liệu nếu revSort là True
        if revSort:
            paginated_data.reverse()

        # Sử dụng Serializer để chuyển đổi đối tượng thành dữ liệu JSON
        serializer = SensorSerializer(paginated_data, many=True)

        # Trả về dữ liệu JSON với số lượng bản ghi
        response_data = {
            'count': len(sensor_data_list),
            'results': serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def device_data_list(request):
    from django.db.models import Q
    try:
        # Lấy giá trị từ request query parameters
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        orderby = request.query_params.get('orderby')
        rowsperpage = request.query_params.get('rowsperpage')
        page = request.query_params.get('page')
        revSort = request.query_params.get('revsort', 'false').lower() == 'true'  # Chuyển đổi thành boolean
        searchFan = request.query_params.get('searchFan', 'false').lower() == 'true'
        searchLamp = request.query_params.get('searchLamp', 'false').lower() == 'true'
        searchAC = request.query_params.get('searchAC', 'false').lower() == 'true'

        # Chuyển đổi giá trị của start và end thành kiểu datetime
        start_datetime = parse_datetime(start) if start else None
        end_datetime = parse_datetime(end) if end else None
        rows_per_page = int(rowsperpage) if rowsperpage else 10  # Mặc định là 10 nếu không có rowsperpage
        current_page = int(page) if page else 0  # Mặc định là trang 0 nếu không có page

        # Lọc dữ liệu theo khoảng thời gian (nếu có)
        if start_datetime and end_datetime:
            device_data = Device.objects.filter(time__range=[start_datetime, end_datetime])
        elif start_datetime:
            device_data = Device.objects.filter(time__gte=start_datetime)
        elif end_datetime:
            device_data = Device.objects.filter(time__lte=end_datetime)
        else:
            device_data = Device.objects.all()
        # Tạo điều kiện lọc cho các thiết bị
        filter_conditions = Q()  # Khởi tạo một điều kiện Q rỗng

        if searchFan:
            filter_conditions |= Q(device='fan')  # Thêm điều kiện cho thiết bị quạt
        if searchLamp:
            filter_conditions |= Q(device='lamp')  # Thêm điều kiện cho thiết bị đèn
        if searchAC:
            filter_conditions |= Q(device='air')  # Thêm điều kiện cho thiết bị điều hòa
        
        # Lọc dữ liệu dựa trên điều kiện
        if filter_conditions:
            device_data = device_data.filter(filter_conditions)


        # Sắp xếp dữ liệu theo biến orderby
        valid_orderby_fields = ['id', 'device', 'status', 'time']
        if orderby not in valid_orderby_fields:
            return Response({'error': 'Invalid orderby parameter'}, status=status.HTTP_400_BAD_REQUEST)

        # Phân trang dữ liệu
        start_index = current_page * rows_per_page
        end_index = start_index + rows_per_page

        # Chuyển queryset thành list và cắt dữ liệu cho trang hiện tại
        device_data_list = list(device_data)
        device_data_list.sort(key=lambda x: getattr(x, 'time'),reverse=True)
        paginated_data = device_data_list[start_index:end_index]

        # Sắp xếp dữ liệu
        paginated_data.sort(key=lambda x: getattr(x, orderby))

        # Đảo ngược dữ liệu nếu revSort là True
        if revSort:
            paginated_data.reverse()

        # Sử dụng Serializer để chuyển đổi đối tượng thành dữ liệu JSON
        serializer = DeviceSerializer(paginated_data, many=True)

        # Trả về dữ liệu JSON với số lượng bản ghi
        response_data = {
            'count': len(device_data_list),
            'results': serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Một biến toàn cục để lưu trữ dữ liệu MQTT
current_mqtt_data = {}


def mqtt_update_data(data):
    """Hàm cập nhật dữ liệu  từ MQTT client"""

    global current_mqtt_data
    current_mqtt_data = data
    
@csrf_exempt
def get_mqtt_data(request):
    """View trả về dữ liệu MQTT dưới dạng JSON"""
    """Lưu vào db"""
    from datetime import datetime
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    current_mqtt_data['time']=current_time
    new_sensor = Sensor(
        temperature=current_mqtt_data['temperature'],
        humidity=current_mqtt_data['humidity'],
        light=current_mqtt_data['light'],
        time=current_mqtt_data['time'] 
    )
    new_sensor.save()
    return JsonResponse(current_mqtt_data)

def mqtt_update_data_for_device(data):
    """Hàm cập nhật dữ liệu  từ MQTT client"""
    
    global current_mqtt_data_for_device
    current_mqtt_data_for_device = data
    if current_mqtt_data_for_device['status']=="on":
        current_mqtt_data_for_device['status']=True
    elif current_mqtt_data_for_device['status']=="off":
        current_mqtt_data_for_device['status']=False
    """Lưu vào db"""
    # current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    # current_mqtt_data_for_device['time']=current_time
    # new_action = Device(
    #     device= current_mqtt_data_for_device['device'],
    #     status=current_mqtt_data_for_device['status'],
    #     time=current_mqtt_data_for_device['time'] 
    # )
    # new_action.save()



current_mqtt_data_for_device = {}
@api_view(['GET', 'POST'])
def change_device(request):
    from testmqtt import MQTTClient
    from app.mqtt_thread import start_device_thread
    from time import sleep
    global current_mqtt_data_for_device

    if request.method == 'POST':
        data = request.data
        # Khởi động thread để nhận dữ liệu từ topic 'iot/device/status'
        start_device_thread()
        client_mqtt = MQTTClient()
        client_mqtt.connect()

        

        # Điều chỉnh tên thiết bị nếu cần
        if data['device'] == 'light':
            data['device'] = 'lamp'
        elif data['device'] == 'ac':
            data['device'] = 'air'

        
        # Gửi lệnh điều khiển thiết bị
        client_mqtt.control_device(data['device'], data['status'])
        
        
        # Đợi dữ liệu cập nhật từ topic
        sleep(4)  # Chờ vài giây để MQTT client có thể nhận dữ liệu từ topic 'iot/device/status'

        # Ngắt kết nối
        client_mqtt.disconnect()

        # Sau khi nhận được dữ liệu từ topic, trả về dữ liệu từ MQTT
        if current_mqtt_data_for_device:
            data_response = {
                "device": current_mqtt_data_for_device['device'],
                "status": current_mqtt_data_for_device['status']
            }
            from datetime import datetime
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            new_action = Device(
                device= data_response['device'],
                status=data_response['status'],
                time=current_time 
            )
            new_action.save()
        else:
            # Nếu không nhận được dữ liệu thì trả về thông báo lỗi
            data_response = {
                "error": "No data received from the device"
            }

        return JsonResponse(data_response)

    elif request.method == 'GET':
        # Xác định danh sách thiết bị cần kiểm tra
        devices = ['lamp', 'air', 'fan']
        results = {}

        for device_name in devices:
            # Lấy thiết bị mới nhất
            latest_device = Device.objects.filter(device=device_name).order_by('-id').first()
            if latest_device:
                results[device_name] = {
                    'status': latest_device.status != "0"
                }
            else:
                results[device_name] = {
                    'status': False
                }
            client_mqtt = MQTTClient()
            client_mqtt.connect()
            client_mqtt.control_device(device_name,results[device_name]['status'])
            client_mqtt.disconnect()
        return Response(results, status=status.HTTP_200_OK)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)






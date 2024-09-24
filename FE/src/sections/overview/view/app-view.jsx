import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import OpacityIcon from '@mui/icons-material/Opacity';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import RotatingFanIcon from '@mui/icons-material/Toys';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './styles.css'; 
import axios from 'axios';
import FanIcon from './FanIcon';
import AcIcon from './AcIcon';


import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

const chatSocket = new WebSocket('wss://iotplan.onrender.com/ws/chat/2/');

export default function AppView() {
  // Trạng thái dữ liệu cảm biến
  const [nhietdo, setNhietdo] = useState('');
  const [doam, setDoam] = useState('');
  const [doamdat, setDoamdat] = useState('');

  const [arrNhietdo, setArrNhietdo] = useState([]);
  const [arrDoam, setArrDoam] = useState([]);
  const [arrDoamDat, setArrDoamDat] = useState([]);

  const [chat, setChat] = useState([]);
  const [lc, setLc] = useState(true);

  // Trạng thái điều khiển thiết bị
  const [light, setLight] = useState(false);
  const [fan, setFan] = useState(false);
  const [ac, setAc] = useState(false);
  useEffect(() => {
    // Hàm gọi API để nhận dữ liệu
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/change-device/');
        const data = response.data;

        // Cập nhật giá trị state dựa trên dữ liệu nhận được
        setLight(data.lamp.status);
        setFan(data.fan.status);
        setAc(data.air.status);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Gọi hàm fetchData khi component được mount
    fetchData();
  }, []);
  const [isLoadingLight, setIsLoadingLight] = useState(false);
  const [isLoadingFan, setIsLoadingFan] = useState(false);
  const [isLoadingAc, setIsLoadingAc] = useState(false);

  // Post data lên server
  const postDeviceStatus = async (device, status, setIsLoading) => {
    try {
      // Bắt đầu trạng thái loading
      setIsLoading(true);
  
      // Gửi yêu cầu đến server
      const response = await fetch('http://127.0.0.1:8000/api/change-device/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device, status }),
      });
  
      // Xử lý phản hồi từ server
      const data = await response.json();
  
      // Cập nhật trạng thái của switch dựa trên phản hồi
      if (device === 'light') {
        setLight(data.status);
      } else if (device === 'fan') {
        setFan(data.status);
      } else if (device === 'ac') {
        setAc(data.status);
      }
    } catch (error) {
      console.error('Error:', error);
      // Xử lý lỗi, có thể hiển thị thông báo lỗi cho người dùng
    } finally {
      // Tắt trạng thái loading
      setIsLoading(false);
    }
  };
  
  // Xử lý thay đổi trạng thái cho Light
  const handleLightToggle = () => {
    const newStatus = !light;
    postDeviceStatus('light', newStatus, setIsLoadingLight);
  };
  
  // Xử lý thay đổi trạng thái cho Fan
  const handleFanToggle = () => {
    const newStatus = !fan;
    postDeviceStatus('fan', newStatus, setIsLoadingFan);
  };
  
  // Xử lý thay đổi trạng thái cho AC
  const handleAcToggle = () => {
    const newStatus = !ac;
    postDeviceStatus('ac', newStatus, setIsLoadingAc);
  };

  useEffect(() => {
    chatSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    chatSocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    chatSocket.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        setChat([...chat, { msg: dataFromServer.message, name: dataFromServer.name }]);
        const messIot = dataFromServer.message.toString();
        const cleanedString = messIot.slice(2, -1);
        const parts = cleanedString.split(' ');
        const num1 = parseFloat(parts[0]);
        const num2 = parseFloat(parts[1]);
        const num3 = parseFloat(parts[2]);
        const dateTime = parts.slice(3).join(' ');

        const roundedNum1 = Math.round(num1 * 10) / 10;
        const roundedNum2 = Math.round(num2 * 10) / 10;
        const roundedNum3 = Math.round(num3 * 10) / 10;

        const nhietDo = roundedNum1.toString();
        const doAm = roundedNum2.toString();
        const doAmdat = roundedNum3.toString();
        const dateTimeHandle = String(dateTime);
        const xuliTime = dateTimeHandle.split(' ');
        const datePart = xuliTime[0];
        const timePart = xuliTime[1].split('.')[0];
        const dateTimeString = `${datePart} ${timePart}`;

        const newObjectNhietdo = {
          title: 'Nhiệt độ',
          temperature: nhietDo,
          datetime: dateTimeString,
        };
        const storedArrayNhietdo = JSON.parse(localStorage.getItem('arrNhietdolc')) || [];
        storedArrayNhietdo.push(newObjectNhietdo);
        if (storedArrayNhietdo.length < 40) {
          localStorage.setItem('arrNhietdolc', JSON.stringify(storedArrayNhietdo));
        } else {
          localStorage.setItem('arrNhietdolc', JSON.stringify([]));
        }

        const newObjectDoam = {
          title: "Độ ẩm",
          humanlity: doAm,
          datetime: dateTimeString,
        };
        const storedArrayDoam = JSON.parse(localStorage.getItem('arrDoamlc')) || [];
        storedArrayDoam.push(newObjectDoam);
        if (storedArrayDoam.length < 40) {
          localStorage.setItem('arrDoamlc', JSON.stringify(storedArrayDoam));
        } else {
          localStorage.setItem('arrDoamlc', JSON.stringify([]));
        }

        const newObjectDoamdat = {
          title: "Độ ẩm đất",
          doAmDat: doAmdat,
          datetime: dateTimeString,
        };
        const storedArrayDoamdat = JSON.parse(localStorage.getItem('arrDoamdatlc')) || [];
        storedArrayDoamdat.push(newObjectDoamdat);
        if (storedArrayDoamdat.length < 40) {
          localStorage.setItem('arrDoamdatlc', JSON.stringify(storedArrayDoamdat));
        } else {
          localStorage.setItem('arrDoamdatlc', JSON.stringify([]));
        }

        setLc((prevLc) => !prevLc);
        setNhietdo(nhietDo);
        setArrNhietdo((prevArr) => [...prevArr, newObjectNhietdo]);
        setDoam(doAm);
        setArrDoam((prevArr) => [...prevArr, newObjectDoam]);
        setDoamdat(doAmdat);
        setArrDoamDat((prevArr) => [...prevArr, newObjectDoamdat]);
      } else {
        console.log('Không tìm thấy số và chuỗi trong chuỗi.');
      }
    };
  }, [chat, lc]);

  const arrNhietdolcChart = JSON.parse(localStorage.getItem('arrNhietdolc')) || [];
  const arrDoamlcChart = JSON.parse(localStorage.getItem('arrDoamlc')) || [];
  const arrDoamdatlcChart = JSON.parse(localStorage.getItem('arrDoamdatlc')) || [];

  const datetimeArrayNhietdo = arrNhietdolcChart.map((item) => item.datetime);
  const nhietdoArray = arrNhietdolcChart.map((item) => item.temperature);

  const datetimeArrayDoam = arrDoamlcChart.map((item) => item.datetime);
  const doamArray = arrDoamlcChart.map((item) => item.humanlity);

  const datetimeArrayDoamdat = arrDoamdatlcChart.map((item) => item.datetime);
  const doamdatArray = arrDoamdatlcChart.map((item) => item.doAmDat);

  // Cập nhật thời gian thực
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fake dữ liệu
  useEffect(() => {
    const fakeData = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/mqtt-data/');
      const data = await response.json();

      const timeString = data.time;
      const now = new Date(timeString);
      const formatTime = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      
      const fakeNhietdo = data.temperature; // Random từ 15 đến 45
      const fakeDoam = data.humidity; // Random từ 0 đến 100
      const fakeDoamdat = data.light; // Random từ 0 đến 100
      const fakeTime = formatTime(now);

      const newObjectNhietdo = {
        title: 'Nhiệt độ',
        temperature: fakeNhietdo.toString(),
        datetime: fakeTime,
      };
      const storedArrayNhietdo = JSON.parse(localStorage.getItem('arrNhietdolc')) || [];
      storedArrayNhietdo.push(newObjectNhietdo);
      if (storedArrayNhietdo.length >= 20) {
        while(storedArrayNhietdo.length >= 20){
          storedArrayNhietdo.shift();
        }
      }
      localStorage.setItem('arrNhietdolc', JSON.stringify(storedArrayNhietdo));

      const newObjectDoam = {
        title: "Độ ẩm",
        humanlity: fakeDoam.toString(),
        datetime: fakeTime,
      };
      const storedArrayDoam = JSON.parse(localStorage.getItem('arrDoamlc')) || [];
      storedArrayDoam.push(newObjectDoam);
      if (storedArrayDoam.length >= 20) {
        while(storedArrayDoam.length >= 20){
          storedArrayDoam.shift();
        }
      }
      localStorage.setItem('arrDoamlc', JSON.stringify(storedArrayDoam));

      const newObjectDoamdat = {
        title: "Độ ẩm đất",
        doAmDat: fakeDoamdat.toString(),
        datetime: fakeTime,
      };
      const storedArrayDoamdat = JSON.parse(localStorage.getItem('arrDoamdatlc')) || [];
      storedArrayDoamdat.push(newObjectDoamdat);
      if (storedArrayDoamdat.length >= 20) {
        while(storedArrayDoamdat.length >= 20){
          storedArrayDoamdat.shift();
        }
      }
      localStorage.setItem('arrDoamdatlc', JSON.stringify(storedArrayDoamdat));

      setNhietdo(fakeNhietdo.toString());
      setDoam(fakeDoam.toString());
      setDoamdat(fakeDoamdat.toString());
      setArrNhietdo(storedArrayNhietdo);
      setArrDoam(storedArrayDoam);
      setArrDoamDat(storedArrayDoamdat);
    };

    // Fake dữ liệu mỗi 5 giây
    const intervalId = setInterval(fakeData, 5000);
    return () => clearInterval(intervalId);
  }, []);


  // Hàm để tạo gradient màu dựa trên nhiệt độ
  const getTemperatureGradient = (temperature) => {
    if (temperature <= 10) {
      return 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)'; // Lạnh (xanh dương)
    }
    if (temperature > 10 && temperature <= 25) {
      return 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)'; // Trung bình (vàng)
    }
    return 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'; // Nóng (đỏ)
  };

  // Hàm để tạo gradient màu dựa trên độ ẩm
  const getHumidityGradient = (humidity) => {
    if (humidity <= 30) {
        return 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'; // Khô (xanh dương nhạt)
    }
    if (humidity > 30 && humidity <= 60) {
        return 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)'; // Trung bình (xanh lá)
    }
    return 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)'; // Ẩm (hồng)
  };

  // Hàm để tạo gradient màu dựa trên độ sáng
  const getBrightnessGradient = (brightness) => {
    if (brightness <= 30) {
        return 'linear-gradient(135deg, #000000 0%, #434343 100%)'; // Tối (đen)
    }
    if (brightness > 30 && brightness <= 70) {
        return 'linear-gradient(135deg, #9e9e9e 0%, #f5f5f5 100%)'; // Trung bình (xám sáng)
    }
    return 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'; // Sáng (hồng nhạt)
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Đồng hồ thời gian thực */}
        <Grid item xs={12} sm={4}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 40, m: 0.8 }} />
            <div style={{ marginLeft: 10, fontSize: 20 }}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </Grid>

        {/* Công tắc điều khiển */}
        <Grid container md={12}>
          <Grid item xs={12} sm={6} md={4}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px', 
              backgroundColor: '#f5f5f5', // Màu nền
              border: '1px solid #ccc', // Khung viền
              borderRadius: '10px' // Bo góc
            }}>
              {isLoadingLight ? (
                <CircularProgress size={30} />
              ) : (
                <Switch
                  checked={light}
                  onChange={handleLightToggle}
                  name="light"
                  color="primary"
                />
              )}
              {/* Tăng kích thước icon */}
              {light ? <Brightness7Icon style={{ fontSize: '2.5rem' }} /> : <Brightness4Icon style={{ fontSize: '2.5rem' }} />}
              {/* Tăng kích thước chữ */}
              <span style={{ marginLeft: 8, fontSize: '1.5rem' }}>Đèn</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px', 
              backgroundColor: '#e0f7fa', // Màu nền
              border: '1px solid #ccc', // Khung viền
              borderRadius: '10px' // Bo góc
            }}>
              {isLoadingFan ? (
                <CircularProgress size={30} />
              ) : (
                <Switch
                  checked={fan}
                  onChange={handleFanToggle}
                  name="fan"
                  color="primary"
                />
              )}
              {/* Tăng kích thước icon */}
              <FanIcon style={{ fontSize: '1.5rem' }} className={`fan-icon ${fan ? 'spinning' : ''}`} />
              {/* Tăng kích thước chữ */}
              <span style={{ marginLeft: 8, fontSize: '1.5rem' }}>Quạt</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px', 
              backgroundColor: '#fff3e0', // Màu nền
              border: '1px solid #ccc', // Khung viền
              borderRadius: '10px' // Bo góc
            }}>
              {isLoadingAc ? (
                <CircularProgress size={30} />
              ) : (
                <Switch
                  checked={ac}
                  onChange={handleAcToggle}
                  name="ac"
                  color="primary"
                />
              )}
              {/* Tăng kích thước icon */}
              <AcIcon style={{ fontSize: '2.5rem' }} className="ac-icon" isOn={ac} />
              {/* Tăng kích thước chữ */}
              <span style={{ marginLeft: 8, fontSize: '1.5rem' }}>Điều hòa</span>
            </div>
          </Grid>
        </Grid>
        {/* Widget dữ liệu cảm biến */}
        <Grid container md={12}>
          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Nhiệt độ"
              total={`${nhietdo} °C`}
              color="success"
              icon={<DeviceThermostatIcon sx={{ fontSize: 60, m: 0.8, color: '#ffab00' }} />}
              sx={{
                background: getTemperatureGradient(nhietdo),
                color: '#fff', // Đảm bảo rằng text hiển thị rõ ràng trên nền
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Độ ẩm không khí"
              total={`${doam} %`}
              color="info"
              icon={<OpacityIcon sx={{ fontSize: 60, m: 0.8, color: '#00b8d9' }} />}
              sx={{
                background: getHumidityGradient(doam),
                color: '#fff', // Đảm bảo rằng text hiển thị rõ ràng trên nền
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Ánh sáng"
              total={`${doamdat} lux`}
              color="warning"
              icon={<Brightness7Icon sx={{ fontSize: 60, m: 0.8, color: '#ffab00' }} />}
              sx={{
                background: getBrightnessGradient(doamdat),
                color: '#fff', // Đảm bảo rằng text hiển thị rõ ràng trên nền
              }}
            />
          </Grid>
        </Grid>

        {/* Biểu đồ */}
        <Grid container xs={12} >
          <Grid xs={12} sm={6} md={4}>  
            <AppWebsiteVisits
              title="Biểu đồ nhiệt độ"
              subheader="Cập nhật gần nhất"
              chart={{
                labels: datetimeArrayNhietdo,
                series: [
                  {
                    name: 'Nhiệt độ',
                    type: 'area',
                    fill: 'gradient',
                    data: nhietdoArray,
                  },
                ],
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <AppWebsiteVisits
              title="Biểu đồ độ ẩm không khí"
              subheader="Cập nhật gần nhất"
              chart={{
                labels: datetimeArrayDoam,
                series: [
                  {
                    name: 'Độ ẩm',
                    type: 'area',
                    fill: 'gradient',
                    data: doamArray,
                  },
                ],
                tooltip: {
                  y: {
                    formatter: (value) => {
                      if (typeof value !== 'undefined') {
                        return `${value.toFixed(1)} %`;
                      }
                      return value;
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <AppWebsiteVisits
              title="Biểu đồ cường độ ánh sáng"
              subheader="Cập nhật gần nhất"
              chart={{
                labels: datetimeArrayDoamdat,
                series: [
                  {
                    name: 'Độ sáng',
                    type: 'area',
                    fill: 'gradient',
                    data: doamdatArray,
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}


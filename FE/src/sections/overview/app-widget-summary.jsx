import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Hàm để tính màu sắc dựa trên giá trị
const getBackgroundColor = (value, type) => {
  let color;
  const percentage = Math.min(1, value / 100); // Tính tỷ lệ phần trăm giá trị

  switch (type) {
    case 'temperature': {
      const tempRed = Math.round(255 * percentage + 150); // Màu đỏ
      color = `rgba(${tempRed}, 0, 0,1)`; // Màu đỏ với độ đậm tùy thuộc vào giá trị
      break;
    }
    case 'humidity': {
      const humBlue = Math.round(255 * percentage+100); // Màu xanh
      color = `rgb(0, ${humBlue}, 255)`; // Màu xanh với độ đậm tùy thuộc vào giá trị
      break;
    }
    case 'light': {
      const lightYellow = Math.round(255 * percentage); // Màu vàng
      color = `rgb(${lightYellow}, ${lightYellow}, 0)`; // Màu vàng với độ đậm tùy thuộc vào giá trị
      break;
    }
    default: {
      color = 'defaultColor';
      break;
    }
  }

  return color;
};

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, total, icon, type, sx, ...other }) {
  // Chuyển đổi total từ string sang number để tính màu
  const value = parseFloat(total);

  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        backgroundColor: getBackgroundColor(value, type),
        color: 'white',
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h4">{total}</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  type: PropTypes.oneOf(['temperature', 'humidity', 'light']).isRequired, // Thêm type vào propTypes
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.string, // Chỉnh sửa kiểu dữ liệu thành string
};

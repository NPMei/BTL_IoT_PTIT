import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';
// ----------------------------------------------------------------------

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;


  const timezone = 'Asia/Ho_Chi_Minh';
  const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
      // colors: ['#F44336', '#E91E63', '#9C27B0']
    },
    labels,
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      },
      
    },
    tooltip: {

      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            if (title.toLowerCase() === 'biểu đồ độ ẩm') {
              return `${value.toFixed(1)} %`;
            } 
              return `${value.toFixed(1)} °C`;
            
          }
          return value;
        },

      },
      x: {
        format: currentTimeInZone
      },
    },
    titlee: title,
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

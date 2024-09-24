import merge from 'lodash/merge';

import { useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function useChart(options) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  let x =  [
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.warning.dark,
    theme.palette.success.darker,
    theme.palette.info.dark,
    theme.palette.info.darker,
  ]


  if(options.titlee.toLowerCase() === 'biểu đồ nhiệt độ'){
    x = [
      theme.palette.warning.main,
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.dark,
      theme.palette.success.darker,
      theme.palette.info.dark,
      theme.palette.info.darker,
    ]
  }

  if(options.titlee.toLowerCase() === 'biểu đồ độ ẩm đất'){
    x = [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.dark,
      theme.palette.success.darker,
      theme.palette.info.dark,
      theme.palette.info.darker,
    ]
  }
  

  const baseOptions = {
    // Colors
    colors:x,
    // Chart
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      // animations: { enabled: false },
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily,
    },

    // States
    // states: {
    //   hover: {
    //     filter: {
    //       type: 'lighten',
    //       value: 0.04,
    //     },
    //   },
    //   active: {
    //     filter: {
    //       type: 'darken',
    //       value: 0.88,
    //     },
    //   },
    // },

    // Fill
    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    // Datalabels
    // dataLabels: {
    //   enabled: false,
    // },

    // Stroke
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round',
    },

    // Grid
    // grid: {
    //   strokeDashArray: 3,
    //   borderColor: theme.palette.divider,
    //   xaxis: {
    //     lines: {
    //       show: false,
    //     },
    //   },
    // },

    // Xaxis
    // xaxis: {
    //   axisBorder: { show: false },
    //   axisTicks: { show: false },
    // },

    // Markers
    // markers: {
    //   size: 0,
    //   strokeColors: theme.palette.background.paper,
    // },

    // Tooltip
    // tooltip: {
    //   theme: false,
    //   x: {
    //     show: true,
    //   },
    // },

    // Legend
    // legend: {
    //   show: true,
    //   fontSize: 13,
    //   position: 'top',
    //   horizontalAlign: 'right',
    //   markers: {
    //     radius: 12,
    //   },
    //   fontWeight: 500,
    //   itemMargin: {
    //     horizontal: 8,
    //   },
    //   labels: {
    //     colors: theme.palette.text.primary,
    //   },
    // },

    // plotOptions
    plotOptions: {
      // Bar
      bar: {
        borderRadius: smUp ? 3 : 1,
        columnWidth: '28%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },

    // Responsive
    responsive: [
      {
        // sm
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: { bar: { columnWidth: '40%' } },
        },
      },
      {
        // md
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: { bar: { columnWidth: '32%' } },
        },
      },
    ],
  };

  return merge(baseOptions, options);
}

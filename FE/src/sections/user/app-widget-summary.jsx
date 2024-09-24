import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, icon, color = 'primary', sx,x, ...other }) {


  if(title.toLowerCase() === 'Đèn'){
    return (
      <Card
        component={Stack}
        spacing={3}
        direction="row"
        sx={{
          px: 3,
          py: 5,
          borderRadius: 2,
          ...sx,
        }}
        {...other}
      >
        {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}
        <Stack direction="row" spacing={{ xs: 12, sm: 2, md: 26 }} justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
          <h1>{x}</h1>
        </Stack>
      </Card>
    );
  } 
  
    return (
      <Card
        component={Stack}
        spacing={3}
        direction="row"
        sx={{
          px: 3,
          py: 5,
          borderRadius: 2,
          ...sx,
        }}
        {...other}
      >
        {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}
        <Stack direction="row" spacing={{ xs: 22, sm: 2, md: 36 }} justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
          <h1>{x}</h1>
        </Stack>
      </Card>
    );
  
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  x: PropTypes.any,
};

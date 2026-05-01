import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      sx={{
        width: '200px',
        height: '200px',
        backgroundColor: blue[500],
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 3,
        justifyContent: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Typography
        sx={{
          letterSpacing: 2,
        }}
      >
        Not found
      </Typography>
      <Box
        component={Link}
        to={'/'}
        sx={{
          width: '80%',
          display: 'flex',
          background: 'white',
          textDecoration: 'none',
          color: blue[500],
          height: '50px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Go home
      </Box>
    </Box>
  );
};

export default NotFound;

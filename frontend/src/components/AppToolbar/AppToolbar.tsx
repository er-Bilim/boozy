import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '@/app/hooks';
import { API_URL } from '@/constants';

const AppToolbar = () => {
  const user = useAppSelector((state) => state.users.user);

  const avatarSrc = user?.avatar ? `${API_URL}/${user.avatar}` : undefined;

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', mr: 4 }}
          >
            Boozy
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/">
              Cocktails
            </Button>
            {user && (
              <>
                <Button color="inherit" component={RouterLink} to="/cocktails/new">
                  Add cocktail
                </Button>
                <Button color="inherit" component={RouterLink} to="/cocktails/my">
                  My cocktails
                </Button>
              </>
            )}
          </Box>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={avatarSrc}>{user.displayName[0]}</Avatar>
              <Typography>{user.displayName}</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppToolbar;

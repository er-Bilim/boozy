import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { BASE_URL } from '@/constants';
import { unsetUser } from '@/features/users/usersSlice';

const AppToolbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.user);

  const avatarSrc = user?.avatar ? `${BASE_URL}/${user.avatar}` : undefined;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            spacing={1.2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 3,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 20,
              }}
            >
              B
            </Box>

            <Typography variant="h6" fontWeight={800}>
              Boozy
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
            >
              Cocktails
            </Button>

            {user && (
              <>
                <Button
                  component={RouterLink}
                  to="/cocktails/new"
                  sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
                >
                  Add cocktail
                </Button>

                <Button
                  component={RouterLink}
                  to="/cocktails/my"
                  sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 600 }}
                >
                  My cocktails
                </Button>
              </>
            )}
          </Stack>

          {user ? (
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: 'center',
                px: 1.5,
                py: 0.8,
                borderRadius: 999,
                bgcolor: 'grey.100',
              }}
            >
              <Avatar src={avatarSrc} sx={{ width: 36, height: 36 }}>
                {user.displayName[0].toUpperCase()}
              </Avatar>

              <Box>
                <Typography
                  fontWeight={700}
                  sx={{ lineHeight: 1.1 }}
                >
                  {user.displayName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Online
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Button
                size="small"
                onClick={() => dispatch(unsetUser())}
                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                component={RouterLink}
                to="/login"
                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
              >
                Login
              </Button>

              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
              >
                Register
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppToolbar;
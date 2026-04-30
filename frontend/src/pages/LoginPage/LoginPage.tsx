import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { login } from '@/features/users/usersThunks';
import { selectLoginLoading } from '@/features/users/usersSlice';

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginForm = z.infer<typeof schema>;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectLoginLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    await dispatch(login(data)).unwrap();
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            p: 4,
            borderRadius: 4,
          }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Login
            </Typography>
            <Typography color="text.secondary">
              Enter your details to continue
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              sx={{ mb: 3 }}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Box>

          <Typography textAlign="center" sx={{ mt: 3 }}>
            Don’t have an account?{' '}
            <Link component={RouterLink} to="/register" fontWeight={600}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { googleLogin, register as registerUser } from '@/features/users/usersThunks';
import { selectRegisterLoading } from '@/features/users/usersSlice';

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  displayName: z.string().min(2, 'Минимум 2 символа'),
  password: z.string().min(6, 'Минимум 6 символов'),
  avatar: z.any().optional(),
});

type RegisterForm = z.infer<typeof schema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await dispatch(registerUser(data)).unwrap();
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
        <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 4 }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Register
            </Typography>
            <Typography color="text.secondary">
              Create your account
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <TextField
              fullWidth
              label="Display name"
              sx={{ mb: 2 }}
              error={!!errors.displayName}
              helperText={errors.displayName?.message}
              {...register('displayName')}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              sx={{ mb: 2 }}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />

            <Button
              fullWidth
              component="label"
              variant="outlined"
              sx={{ mb: 2, borderRadius: 2, textTransform: 'none' }}
            >
              Upload avatar
              <input hidden type="file" {...register('avatar')} />
            </Button>

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
              {loading ? 'Loading...' : 'Register'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;

                await dispatch(googleLogin(credentialResponse.credential)).unwrap();
                navigate('/');
              }}
              onError={() => {
                console.log('Google login failed');
              }}
            />
          </Box>

          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" fontWeight={600}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
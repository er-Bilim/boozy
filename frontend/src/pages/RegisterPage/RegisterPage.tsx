import { useForm } from 'react-hook-form';
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
import {
  googleLogin,
  register as registerUser,
} from '@/features/users/usersThunks';
import { selectRegisterLoading } from '@/features/users/usersSlice';
import FileInput from '@/components/FileInput/FileInput';
import { blue } from '@mui/material/colors';
import type { ChangeEvent } from 'react';
import { schemaRegister, type RegisterFormData } from './lib/validation';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schemaRegister),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await dispatch(registerUser(data)).unwrap();
    navigate('/');
  };

  const onChangeFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;

    if (files && files[0] && name === 'avatar') {
      setValue(name, files[0]);
    }
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
            <Typography variant="h5">Register</Typography>
            <Typography color="text.secondary">Create your account</Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '100%',
                  overflow: 'hidden',
                  border: 4,
                  mb: 3,
                  borderColor: blue[500],
                }}
              >
                <FileInput
                  label="Artist Photo"
                  {...register('avatar')}
                  onChange={onChangeFileHandler}
                />
              </Box>
            </Box>
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

                await dispatch(
                  googleLogin(credentialResponse.credential),
                ).unwrap();
                navigate('/');
              }}
              onError={() => {
                console.log('Google login failed');
              }}
            />
          </Box>

          <Typography sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;

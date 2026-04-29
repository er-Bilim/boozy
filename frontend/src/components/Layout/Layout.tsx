import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import AppToolbar from '@/components/AppToolbar/AppToolbar';

const Layout = () => {
  return (
    <>
      <AppToolbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;

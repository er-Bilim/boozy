import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <CssBaseline />
      <App />
    </BrowserRouter>
  </StrictMode>,
);

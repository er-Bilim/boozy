import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';
import { persistor, store } from './app/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ToastContainer />
          <CssBaseline />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);

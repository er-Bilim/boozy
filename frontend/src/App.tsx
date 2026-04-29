import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Layout from '@/components/Layout/Layout';
import AddCocktailPage from '@/pages/AddCocktailPage/AddCocktailPage';
import CocktailDetailsPage from '@/pages/CocktailDetailsPage/CocktailDetailsPage';
import CocktailsPage from '@/pages/CocktailsPage/CocktailsPage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import MyCocktailsPage from '@/pages/MyCocktailsPage/MyCocktailsPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CocktailsPage />} />
        <Route path="cocktails/:id" element={<CocktailDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="cocktails/new" element={<AddCocktailPage />} />
          <Route path="cocktails/my" element={<MyCocktailsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

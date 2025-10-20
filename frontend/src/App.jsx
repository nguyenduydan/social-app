import { BrowserRouter } from 'react-router';
import { Toaster } from './components/ui/sonner';
import "@/assets/global.css";
import { Route, Routes } from 'react-router';
import MainLayout from './components/layout/MainLayout';
//Pages
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';

const App = () => {
  const applyTheme = useThemeStore((s) => s.applyTheme); //only use applyTheme method

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path='/signin' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />

          {/* protect routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/profile' element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

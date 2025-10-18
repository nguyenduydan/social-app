import React, { useEffect } from 'react';
import "@/assets/global.css";
import { Navigate, Route, Routes } from 'react-router';
import { useAuthStore } from './store/useAuthStore';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Home from '@/pages/Home';
import LoadingPage from '@/components/common/loadingPage';
import Navbar from './components/layout/Navbar';
import MainLayout from './components/layout/MainLayout';
import Profile from './pages/Profile';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // console.log({ authUser });

  if (isCheckingAuth) return (
    <div>
      <LoadingPage />
    </div>
  );


  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
          {/* Profile */}
        </Route>
        {/* Auth */}
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
      </Routes>
    </div>
  );
};

export default App;

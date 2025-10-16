import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './store/useAuthStore';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Home from '@/pages/Home';
import LoadingPage from './components/LoadingPage';

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
      <Toaster />
      <Routes>
        {/* Home */}
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        {/* Profile */}

        {/* Auth */}
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
      </Routes>
    </div>
  );
};

export default App;

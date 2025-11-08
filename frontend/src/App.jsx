import { Toaster } from '@/components/ui/sonner';
import "@/assets/global.css";
import { Route, Routes, BrowserRouter } from 'react-router';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useThemeStore } from '@/store/useThemeStore';
import { useEffect } from 'react';
import { ScrollProvider } from '@/contexts/ScrollContext';
//Pages
import MainLayout from '@/components/common/layout/MainLayout';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import ConversationPage from '@/pages/ConversationPage';

import NotFound from '@/pages/NotFound';
import MiniChatProvider from './components/Conversation/MiniChatManager';

const App = () => {
  const applyTheme = useThemeStore((s) => s.applyTheme); //only use applyTheme method

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <ScrollProvider>
          <MiniChatProvider maxChats={3}>
            <Routes>
              {/* public routes */}
              <Route path='/signin' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='*' element={<NotFound />} />

              {/* protect routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/profile/:username?' element={<ProfilePage />} />
                  <Route path='/conversations' element={<ConversationPage />} />
                </Route>
              </Route>
            </Routes>
          </MiniChatProvider>
        </ScrollProvider>
      </BrowserRouter>
    </>
  );
};

export default App;

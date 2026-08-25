import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/ToastContainer';

import { CinematicVideoBackground } from './components/background/CinematicVideoBackground';
import { HeaderNotice } from './components/layout/HeaderNotice';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { TournamentDetails } from './pages/TournamentDetails';
import { TeamRegistration } from './pages/TeamRegistration';
import { Leaderboard } from './pages/Leaderboard';
import { Results } from './pages/Results';
import { Winners } from './pages/Winners';
import { WinnerDetails } from './pages/WinnerDetails';
import { Media } from './pages/Media';
import { YouTubePage } from './pages/YouTube';
import { News } from './pages/News';
import { NewsDetails } from './pages/NewsDetails';
import { Rules } from './pages/Rules';
import { FAQPage } from './pages/FAQ';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { NotFound } from './pages/NotFound';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <ScrollToTop />

          <CinematicVideoBackground>
            <div className="min-h-screen flex flex-col font-sans text-gray-100 selection:bg-orange-500 selection:text-white">

              <HeaderNotice />
              <Navbar />

              <main className="flex-1">
                <Routes>

                  {/* =========================
                      PUBLIC PAGES
                  ========================== */}

                  <Route path="/" element={<Home />} />

                  <Route
                    path="/tournaments"
                    element={<Tournaments />}
                  />

                  <Route
                    path="/tournaments/:slug"
                    element={<TournamentDetails />}
                  />

                  <Route
                    path="/leaderboard"
                    element={<Leaderboard />}
                  />

                  <Route
                    path="/results"
                    element={<Results />}
                  />

                  <Route
                    path="/winners"
                    element={<Winners />}
                  />

                  <Route
                    path="/winners/:id"
                    element={<WinnerDetails />}
                  />

                  <Route
                    path="/media"
                    element={<Media />}
                  />

                  <Route
                    path="/youtube"
                    element={<YouTubePage />}
                  />

                  <Route
                    path="/news"
                    element={<News />}
                  />

                  <Route
                    path="/news/:slug"
                    element={<NewsDetails />}
                  />

                  <Route
                    path="/rules"
                    element={<Rules />}
                  />

                  <Route
                    path="/faq"
                    element={<FAQPage />}
                  />

                  <Route
                    path="/about"
                    element={<About />}
                  />

                  <Route
                    path="/contact"
                    element={<Contact />}
                  />

                  {/* =========================
                      AUTHENTICATION
                  ========================== */}

                  <Route
                    path="/login"
                    element={<Login />}
                  />

                  <Route
                    path="/signup"
                    element={<Signup />}
                  />

                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                  />

                  {/* =========================
                      PROTECTED PAGES
                  ========================== */}

                  <Route
                    path="/tournaments/:slug/register"
                    element={
                      <ProtectedRoute>
                        <TeamRegistration />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/whatsapp"
                    element={
                      <ProtectedRoute>
                        <WhatsAppPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* =========================
                      404
                  ========================== */}

                  <Route
                    path="*"
                    element={<NotFound />}
                  />

                </Routes>
              </main>

              <Footer />

            </div>

            <ToastContainer />

          </CinematicVideoBackground>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

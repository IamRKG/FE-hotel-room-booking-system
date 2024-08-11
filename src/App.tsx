import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Homepage';
import RoomDetails from './pages/RoomDetails';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDashboard from './pages/UserDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
            <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

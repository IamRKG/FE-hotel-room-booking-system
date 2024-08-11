import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X } from 'react-feather';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('You have been successfully logged out!', {
      position: 'top-right',
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const NavItems = () => (
    <>
      <li><Link to="/" className="hover:text-orange-200">Home</Link></li>
      {user ? (
        <>
          <li>Welcome, {user.name}</li>
          {/* <li><Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link></li> */}
          {/* <li><NotificationCenter /></li> */}
          <li><button onClick={handleLogout} className="hover:text-orange-200">Logout</button></li>
        </>
      ) : (
        <>
          <li><Link to="/register" className="hover:text-orange-200">Register</Link></li>
          <li><Link to="/login" className="hover:text-orange-200">Login</Link></li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-orange-950 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">PATHIYAM</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <NavItems />
          </ul>
        </nav>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col space-y-2">
            <NavItems />
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

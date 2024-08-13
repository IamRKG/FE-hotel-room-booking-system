import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const UserDropdown = () => (
    <AnimatePresence>
    {isDropdownOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10"
      >
        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
      </motion.div>
    )}
  </AnimatePresence>
  
  );

  const NavItems = () => (
    <>
      <li><Link to="/" className="hover:text-orange-200 transition duration-300">Home</Link></li>
      {user ? (
        <li className="relative user-dropdown">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center text-orange-200 hover:text-white"
          >
            {user.name}
            <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {isDropdownOpen && <UserDropdown />}
        </li>
      ) : (
        <>
          <li><Link to="/register" className="hover:text-orange-200 transition duration-300">Register</Link></li>
          <li><Link to="/login" className="hover:text-orange-200 transition duration-300">Login</Link></li>
        </>
      )}
    </>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-gradient-to-r from-orange-950 to-orange-900 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <Link to="/" className="text-2xl font-bold hover:text-orange-200 transition duration-300">
            PATHIYAM
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <NavItems />
            </ul>
          </nav>
          <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-orange-900"
          >
            <ul className="flex flex-col space-y-2 p-4">
              <NavItems />
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

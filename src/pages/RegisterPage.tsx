import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-start pt-20 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your account
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

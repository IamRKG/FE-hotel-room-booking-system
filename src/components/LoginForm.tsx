import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: login,
    onError: (error: any) => {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || { general: error.response.data.message });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    },
  });
  const setUser = useAuthStore((state) => state.setUser);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = await loginMutation.mutateAsync({email, password});
        setUser(user);
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && <p className="text-red-500">{errors.general}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-orange-950 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;

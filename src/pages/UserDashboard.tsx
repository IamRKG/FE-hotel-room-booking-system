import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings } from '../services/api';
import { motion } from 'framer-motion';
import { FaCalendarAlt,FaMoneyBillWave, FaHotel } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const UserDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['userBookings'],
    queryFn: getUserBookings
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-orange-950">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Here are your current bookings:</p>
        </motion.div>
        
        {bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <NoBookingsState />
        )}
      </div>
    </div>
  );
};

const BookingCard: React.FC<{ booking: any }> = ({ booking }) => (
  <motion.div 
    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="bg-orange-100 text-orange-950 p-4">
      <h2 className="text-xl font-semibold">{booking.roomId?.type || 'Room'}</h2>
      <p>Room Number: {booking.roomId?.number || 'N/A'}</p>
    </div>
    <div className="p-4">
      <div className="flex items-center mb-2 text-gray-700">
        <FaCalendarAlt className="text-orange-500 mr-2" />
        <span>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center mb-2 text-gray-700">
        <FaCalendarAlt className="text-orange-500 mr-2" />
        <span>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center mb-4 text-gray-700">
        <FaMoneyBillWave className="text-orange-500 mr-2" />
        <span>Total Price: ${booking.totalPrice}</span>
      </div>
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
        {booking.status}
      </div>
    </div>
  </motion.div>
);


const NoBookingsState = () => (
  <motion.div 
    className="bg-white rounded-lg shadow-md p-8 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <FaHotel className="text-6xl text-orange-950 mx-auto mb-4" />
    <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
    <p className="text-gray-600 mb-4">Ready to plan your next stay?</p>
    <Link to="/" className="bg-orange-950 text-white px-6 py-2 rounded-full hover:bg-orange-900 transition-colors duration-300">
      Book a Room
    </Link>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="bg-gray-200 h-24 mb-4"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorState = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <FaHotel className="text-6xl text-red-500 mx-auto mb-4" />
    <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
    <p className="text-gray-600 mb-4">We couldn't load your bookings. Please try again.</p>
    <button onClick={() => window.location.reload()} className="bg-orange-950 text-white px-6 py-2 rounded-full hover:bg-orange-900 transition-colors duration-300">
      Retry
    </button>
  </div>
);

const getStatusColor = (status:any) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default UserDashboard;

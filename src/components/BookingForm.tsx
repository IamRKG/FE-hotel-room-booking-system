import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createBooking, checkRoomAvailability } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaCalendarAlt } from 'react-icons/fa'; // Import calendar icon
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const BookingForm: React.FC<{ roomId: string; price: number }> = ({ roomId, price }) => {
  const { user } = useAuthStore();
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { data: isAvailable, refetch: checkAvailability } = useQuery({
    queryKey: ['roomAvailability', roomId, checkInDate, checkOutDate],
    queryFn: () => checkRoomAvailability(roomId, checkInDate?.toISOString() ?? '', checkOutDate?.toISOString() ?? ''),    enabled: false,
  });

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      checkAvailability();
    }
  }, [checkInDate, checkOutDate, checkAvailability]);

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates');
      return false;
    }

    if (checkInDate < today) {
      setError('Check-in date cannot be in the past');
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDates() && checkInDate && checkOutDate) {
      const booking = {
        roomId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalPrice: calculateTotalPrice(),
      };
      bookingMutation.mutate(booking);
    }
  };

  const calculateTotalPrice = () => {
    if (checkInDate && checkOutDate) {
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      return nights * price;
    }
    return 0;
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="mb-4">Please log in to make a booking.</p>
        <Link to="/login" className="bg-orange-950 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded">
          Log In
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center text-green-600">
        <p className="text-xl font-bold">Booking Successful!</p>
        <p>Your room has been booked successfully.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <div className="relative">
          <DatePicker
  selected={checkInDate}
  onChange={(date: Date | null) => setCheckInDate(date)}
  minDate={new Date()}
  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  required
  placeholderText="Select check-in date"
  isClearable
  dateFormat="MMMM d, yyyy"
  withPortal
/>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><FaCalendarAlt/></div>
          </div>
        </div>
        <div className="relative">
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <div className="relative">
          <DatePicker
  selected={checkOutDate}
  onChange={(date: Date | null) => setCheckOutDate(date)}
  minDate={checkInDate || new Date()}
  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  required
  placeholderText="Select check-out date"
  isClearable
  dateFormat="MMMM d, yyyy"
  withPortal
/>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><FaCalendarAlt/></div>
          </div>
        </div>
        {checkInDate && checkOutDate && (
          <div className={`p-3 rounded-md ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {isAvailable ? "Room is available for selected dates." : "Room is not available for selected dates."}
          </div>
        )}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {checkInDate && checkOutDate && (
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-bold text-lg">Total Price: ${calculateTotalPrice()}</p>
            <p className="text-sm text-gray-600">for {calculateNights(checkInDate.toISOString(), checkOutDate.toISOString())} night(s)</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-orange-950 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!isAvailable || bookingMutation.isPending}
        >
          {bookingMutation.isPending ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

const calculateNights = (checkInDate: string, checkOutDate: string) => {
  if (checkInDate && checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
};

export default BookingForm;

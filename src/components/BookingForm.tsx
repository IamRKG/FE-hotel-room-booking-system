import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { checkRoomAvailability, createBooking } from '../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

interface BookingFormProps {
  roomId: string;
  price: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomId, price }) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: availability, isLoading, refetch } = useQuery({
    queryKey: ['availability', roomId, checkInDate, checkOutDate],
    queryFn: () => checkRoomAvailability(roomId, checkInDate?.toISOString() ?? '', checkOutDate?.toISOString() ?? ''),
    enabled: !!checkInDate && !!checkOutDate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/rooms/${roomId}` } });
      return;
    }
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    setIsBooking(true);
    try {
      await createBooking({
        roomId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalPrice: price * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)),
      });
      toast.success('Booking successful and an email has been sent to your registered email address.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
          Check-in Date
        </label>
        <div className="relative">
          <DatePicker
            selected={checkInDate}
            placeholderText='Check-in Date'
            onChange={(date: Date | null) => {
              if (date) {
                setCheckInDate(date);
                if (checkOutDate && date >= checkOutDate) {
                  setCheckOutDate(null);
                }
                if (checkOutDate) refetch();
              }
            }}
            selectsStart
            startDate={checkInDate ?? undefined}
            endDate={checkOutDate ?? undefined}
            minDate={new Date()}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950"
              wrapperClassName="w-full"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <FaCalendarAlt />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
          Check-out Date
        </label>
        <div className="relative">
          <DatePicker
            selected={checkOutDate}
             placeholderText='Check-out Date'
            onChange={(date: Date | null) => {
              if (date) {
                setCheckOutDate(date);
                if (checkInDate) refetch();
              }
            }}
            selectsEnd
            startDate={checkInDate ?? undefined}
            endDate={checkOutDate ?? undefined}
            minDate={checkInDate ?? new Date()}
            wrapperClassName="w-full"
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <FaCalendarAlt />
          </div>
        </div>
      </div>

      {isLoading && <p className="text-orange-950">Checking availability...</p>}
      {availability !== undefined && (
        <p className={availability ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {availability ? 'Room is available for selected dates!' : 'Room is not available for selected dates.'}
        </p>
      )}

      <div>
        <p className="text-lg font-semibold">
          Total Price: ${price * (checkOutDate && checkInDate ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0)}
        </p>
      </div>

      <motion.button
  type="submit"
  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-950 hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-950"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  disabled={!availability || isBooking}
>
  {isBooking ? (
    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : 'Book Now'}
</motion.button>
    </motion.form>
  );
};

export default BookingForm;

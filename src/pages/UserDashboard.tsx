import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings } from '../services/api';

const UserDashboard: React.FC = () => {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['userBookings'],
    queryFn: getUserBookings
  });

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Bookings</h1>
      {bookings && bookings.length > 0 ? (
        <ul className="space-y-4">
       {bookings.map((booking) => (
  <li key={booking._id} className="border p-4 rounded-lg">
    {booking.room && (
      <>
        <p>Room Type: {booking.room.type}</p>
        <p>Room Number: {booking.room.number}</p>
      </>
    )}
    <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
    <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
    <p>Total Price: ${booking.totalPrice}</p>
    <p>Status: {booking.status}</p>
  </li>
))}

        </ul>
      ) : (
        <p>You have no bookings yet.</p>
      )}
    </div>
  );
};

export default UserDashboard;
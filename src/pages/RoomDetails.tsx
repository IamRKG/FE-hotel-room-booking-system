import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaBed, FaUsers, FaWifi, FaTv, FaSwimmingPool } from 'react-icons/fa';
// import AvailabilityChecker from '../components/AvailabilityChecker';
import BookingForm from '../components/BookingForm';
import { Room } from '../types/room';
import { getRoom } from '../services/api';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: room, isLoading, error } = useQuery<Room, Error>({
    queryKey: ['room', id],
    queryFn: () => getRoom(id!),
  });

  if (isLoading) return <div className="text-center mt-8">Loading room details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading room details</div>;
  if (!room) return <div className="text-center mt-8">Room not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative h-96">
        <img src={`/images/rooms/${room.type.toLowerCase()}.png`} alt={room.type} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <h1 className="text-4xl font-bold text-white">{room.type} Room</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Room Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaBed />
                  <span className='ml-2'>Room {room.number}</span>
                </div>
                <div className="flex items-center">
                  <FaUsers />
                  <span className='ml-2'>Capacity: {room.capacity} persons</span>
                </div>
                <div className="flex items-center">
                  <span>${room.price} per night</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {getAmenityIcon(amenity)}
                    <span className="ml-2">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* <AvailabilityChecker roomId={room._id} /> */}
          </div>
          
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <BookingForm roomId={room._id} price={room.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi': return <FaWifi />;
    case 'tv': return <FaTv  />;
    case 'pool': return <FaSwimmingPool />;
    default: return null;
  }
};

export default RoomDetails;

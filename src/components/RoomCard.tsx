import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaInfoCircle } from 'react-icons/fa';
import { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <img 
          src={`/images/rooms/${room.type.toLowerCase()}.png`}
          alt={room.type} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 bg-orange-900 text-white px-2 py-1 m-2 rounded-md">
          {room.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">Room {room.number}</h3>
        <div className="flex items-center mb-2">
          <FaUsers size={16} color='#333' />
          <span className="ml-2">Capacity: {room.capacity} persons</span>
        </div>
        <div className="flex items-center mb-4">
          
          <span className="text-lg font-bold">${room.price}</span>
          <span className="text-sm text-gray-600 ml-1">per night</span>
        </div>
        <div className="flex justify-between">
          <Link 
            to={`/rooms/${room._id}`}
            className="flex-1 bg-orange-950 text-white text-center py-2 rounded-md hover:bg-orange-900 transition duration-300 mr-2"
          >
            Book Now
          </Link>
          <Link 
            to={`/rooms/${room._id}`}
            className="flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
          >
            <FaInfoCircle size={16} color='#333'/>
            <span className="ml-2">Details</span>
            
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;

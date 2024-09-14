import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../types/room';
import { motion } from 'framer-motion';
import { FaBed, FaUsers, FaWifi, FaTv, FaParking, FaPhone, FaWhatsapp } from 'react-icons/fa';
import RoomCardSkeleton from './RoomCardSkeleton';

interface RoomCardProps {
  room: Room;
  isLoading?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isLoading = false }) => {
  if (isLoading) {
    return <RoomCardSkeleton />;
  }

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `tel:+919443222997`; // Replace with your hotel's phone number
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi, I'm interested in Room ${room.number} (${room.type}).`;
    window.open(`https://wa.me/+919443222997?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Link to={`/rooms/${room._id}`} className="block">
      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <img src={`/images/rooms/${room.type.toLowerCase()}.png`} alt={`Room ${room.number}`} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{room.type} Room {room.number}</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <FaBed className="text-orange-950" />
              <span>{room.capacity} {room.capacity > 1 ? 'beds' : 'bed'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="text-orange-950" />
              <span>Max {room.capacity} guests</span>
            </div>
          </div>
          <div className="flex space-x-4 mb-6">
            {room.amenities.includes('wifi') && <FaWifi className="text-orange-950" />}
            {room.amenities.includes('tv') && <FaTv className="text-orange-950" />}
            {room.amenities.includes('parking') && <FaParking className="text-orange-950" />}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-orange-950">${room.price}<span className="text-sm font-normal">/night</span></span>
            <div className="flex space-x-2">
              <button 
                onClick={handleCall}
                className="bg-orange-950 text-white px-4 py-2 rounded-full hover:bg-orange-900 transition duration-300 flex items-center"
              >
                <FaPhone className="mr-2" />
                <span className="whitespace-nowrap">Call</span>
              </button>
              <button 
                onClick={handleWhatsApp}
                className="bg-orange-950 text-white px-4 py-2 rounded-full hover:bg-orange-900 transition duration-300 flex items-center"
              >
                <FaWhatsapp className="mr-2" />
                <span className="whitespace-nowrap">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};export default RoomCard;
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../services/api';
import { Room } from '../types/room';
import RoomCard from '../components/RoomCard';
import { motion } from 'framer-motion';
import bannerImage from '../assets/banner.png';

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: 0,
    maxPrice: 1000
  });

  const { data: rooms, isLoading, error } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: getRooms
  });

  
  const filteredRooms = Array.isArray(rooms) 
  ? rooms.filter(room => 
    
      (filters.type === '' || room.type === filters.type) &&
      room.capacity >= filters.minCapacity &&
      room.price <= filters.maxPrice
    )
  : [];


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: name === 'maxPrice' ? Number(value) : value }));
  };



  if (isLoading) return <div className="text-center mt-8">Loading rooms...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading rooms</div>;

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div 
  className="bg-cover bg-center h-96 rounded-lg flex items-center justify-center mb-12" 
  style={{
    backgroundImage: `url(${bannerImage})`,
  }}
>
  <div className="text-center text-white bg-black bg-opacity-50 p-8 rounded-lg">
    <h1 className="text-5xl font-bold mb-4">Luxury Awaits You</h1>
    <p className="text-2xl">Discover comfort beyond imagination</p>
  </div>
</div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Find Your Perfect Room</h2>
          <div className="flex flex-wrap gap-4">
            <select
              name="type"
              onChange={handleFilterChange}
              className="p-2 border rounded-full"
            >
              <option value="">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </select>
            <input
              type="number"
              name="minCapacity"
              placeholder="Min Capacity"
              onChange={handleFilterChange}
              className="p-2 border rounded-full"
            />
            <div className="flex items-center">
              <input
                type="range"
                name="maxPrice"
                min="0"
                max="1000"
                step="50"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-48 bg-orange-950"
              />
              <span className="ml-2">${filters.maxPrice}</span>
            </div>
          </div>
        </motion.div>

        

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6">All Available Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredRooms?.map((room) => (
    <motion.div 
      key={room._id} 
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <RoomCard room={room} />
    </motion.div>
  ))}
</div>
        </motion.div>

        {/* <Link to="/booking">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-8 right-8 bg-orange-950 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-900 transition-colors duration-300"
  >
    Book Now
  </motion.button>
</Link> */}
      </motion.div>
    </div>
  );
};

export default HomePage;

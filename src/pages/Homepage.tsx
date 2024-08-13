import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRooms } from '../services/api';
import RoomCard from '../components/RoomCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import bannerImage from '../assets/banner.png';


const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const filteredRooms = data?.pages.flatMap(page => 
    page.filter(room => 
      activeTab === 'all' || room.type === activeTab
    )
  ) || [];

  const buttonVariants = {
    active: { backgroundColor: '#7c2d12', color: '#ffffff' },
    inactive: { backgroundColor: '#e5e7eb', color: '#1f2937' }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-cover bg-center h-64 relative" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold text-center">Discover Your Perfect Stay</h1>
        </div>
      </div>

      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <div className="flex space-x-4">
            {['all', 'Single', 'Double', 'Suite'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded"
                variants={buttonVariants}
                animate={activeTab === tab ? 'active' : 'inactive'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'all' ? 'All Rooms' : tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <motion.div 
                  key={room._id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {isFetchingNextPage ? (
          <p className="text-center mt-8">Loading more rooms...</p>
        ) : (
          <div ref={ref} className="h-10" />
        )}
      </main>

    </div>
  );
};

export default HomePage;

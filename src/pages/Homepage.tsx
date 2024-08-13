import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRooms } from '../services/api';
import RoomCard from '../components/RoomCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import bannerImage from '../assets/banner.png';
import { Room } from '../types/room';
import { Parallax } from 'react-parallax';


const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage,isLoading } = useInfiniteQuery({
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
       <Parallax
        bgImage={bannerImage}
        strength={0}
        className="h-64 md:h-96"
      >
     <div className="bg-cover bg-center h-64 md:h-96 relative overflow-hidden">
    
  <div className="absolute inset-0 bg-black opacity-50"></div>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <motion.h1 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-4xl md:text-6xl text-white font-bold text-center mb-4"
    >
      Discover Your Perfect Stay
    </motion.h1>
  </div>
</div>
</Parallax>


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
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.4 }}
>
  <h2 className="text-3xl font-bold mb-6">All Available Rooms</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {isLoading || !filteredRooms
      ? Array.from({ length: 6 }).map((_, index) => (
          <RoomCard key={`skeleton-${index}`} room={{} as Room} isLoading={true} />
        ))
      : filteredRooms.map((room) => (
          <motion.div 
            key={room._id} 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <RoomCard room={room} isLoading={false} />
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

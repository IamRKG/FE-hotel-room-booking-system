import React, { useState, useEffect} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRooms } from '../services/api';
import RoomCard from '../components/RoomCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Room } from '../types/room';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Parallax } from 'react-parallax';

const HomePage: React.FC = () => {
  const bannerImages = [
    { image: '/gallary/img1.jpeg', text: 'Luxurious Accommodations' },
    { image: '/gallary/img2.jpeg', text: 'Stunning Views' },
    { image: '/gallary/img3.jpeg', text: 'Elegant Dining' },
    { image: '/gallary/img4.jpeg', text: 'Relaxing Spa Retreats' },
    { image: '/gallary/img5.jpeg', text: 'Modern Amenities' },
    { image: '/gallary/img6.jpeg', text: 'Exquisite Suites' },
    { image: '/gallary/img7.jpeg', text: 'Breathtaking Landscapes' },
    { image: '/gallary/img8.jpeg', text: 'Gourmet Cuisine' },
    { image: '/gallary/img9.jpeg', text: 'Tranquil Getaways' },
    { image: '/gallary/img10.jpeg', text: 'Unforgettable Experiences' },
    { image: '/gallary/img11.jpeg', text: 'Exclusive Services' },
    { image: '/gallary/img12.jpeg', text: 'Scenic Beauty' },
    { image: '/gallary/img13.jpeg', text: 'Cozy Retreats' },
    { image: '/gallary/img14.jpeg', text: 'Luxe Interiors' },
    { image: '/gallary/img15.jpeg', text: 'Serene Atmospheres' },
    { image: '/gallary/img16.jpeg', text: 'Opulent Decor' },
    { image: '/gallary/img17.jpeg', text: 'Majestic Surroundings' },
    { image: '/gallary/img18.jpeg', text: 'Unparalleled Comfort' }
  ];
  
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    dots: true,
  };
 

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
    <div className="bg-gray-100 min-h-screen" >
   <section className="relative w-full h-[calc(100vh-64px)] overflow-hidden">



   <Slider {...sliderSettings} className="absolute inset-0 h-full">

      {bannerImages.map((slide, index) => (
      <div key={index} className="h-full relative">

<Parallax
  bgImage={slide.image}
  strength={600}
  bgImageStyle={{height: '100%', width: '100%', objectFit: 'cover'}}
>
            <div className="bg-cover bg-center h-screen relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="relative z-10 text-center px-4">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-6xl text-white font-bold mb-4"
                >
                  {slide.text}
                </motion.h1>
              </div>
            </div>
          </Parallax>
        </div>
      ))}
    </Slider>
</section>
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
};export default HomePage;



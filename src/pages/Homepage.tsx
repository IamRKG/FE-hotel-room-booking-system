import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRooms } from '../services/api';
import RoomCard from '../components/RoomCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Room } from '../types/room';
import { Parallax } from 'react-parallax';
import { FaSearch, FaConciergeBell, FaSpa, FaUtensils, FaPhone, FaWhatsapp } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const bannerImages = [
    { image: '/gallary/img1.jpeg', text: 'Luxurious Accommodations' },
    { image: '/gallary/img2.jpeg', text: 'Stunning Mountain Views' },
    { image: '/gallary/img3.jpeg', text: 'Elegant Dining by the Lake' },
    { image: '/gallary/img4.jpeg', text: 'Relaxing Forest Spa Retreats' },
    { image: '/gallary/img5.jpeg', text: 'Modern Amenities in Natural Settings' },
    { image: '/gallary/img6.jpeg', text: 'Exquisite Suites with Garden Views' },
    { image: '/gallary/img7.jpeg', text: 'Breathtaking Coastal Landscapes' },
    { image: '/gallary/img8.jpeg', text: 'Gourmet Cuisine with Organic Ingredients' },
    { image: '/gallary/img9.jpeg', text: 'Tranquil Riverside Getaways' },
    { image: '/gallary/img10.jpeg', text: 'Unforgettable Experiences in Nature' },
    { image: '/gallary/img11.jpeg', text: 'Exclusive Services in Lush Surroundings' },
    { image: '/gallary/img12.jpeg', text: 'Scenic Beauty of Rolling Hills' },
    { image: '/gallary/img13.jpeg', text: 'Cozy Retreats in Alpine Meadows' },
    { image: '/gallary/img14.jpeg', text: 'Luxe Interiors Inspired by Nature' },
    { image: '/gallary/img15.jpeg', text: 'Serene Atmospheres in Tropical Paradise' },
    { image: '/gallary/img16.jpeg', text: 'Opulent Decor with Natural Elements' },
    { image: '/gallary/img17.jpeg', text: 'Majestic Surroundings of Ancient Forests' },
    { image: '/gallary/img18.jpeg', text: 'Unparalleled Comfort in Desert Oasis' },
    { image: '/gallary/img19.jpeg', text: 'Eco-Friendly Luxury Amidst Wilderness' },
    { image: '/gallary/img20.jpeg', text: 'Panoramic Views of Pristine Beaches' },
    { image: '/gallary/img21.jpeg', text: 'Secluded Hideaways in Bamboo Groves' },
    { image: '/gallary/img22.jpeg', text: 'Rustic Charm in Wildflower Meadows' },
    { image: '/gallary/img23.jpeg', text: 'Zen-Inspired Retreats by Waterfalls' },
    { image: '/gallary/img24.jpeg', text: 'Lavish Suites with Rainforest Canopy Views' },
    { image: '/gallary/img25.jpeg', text: 'Intimate Escapes in Blooming Gardens' },
    { image: '/gallary/img26.jpeg', text: 'Luxurious Treehouses in Ancient Woods' },
    { image: '/gallary/img27.jpeg', text: 'Cliffside Villas with Ocean Panoramas' },
    { image: '/gallary/img28.jpeg', text: 'Serene Lakeside Cabins for Ultimate Relaxation' },
    { image: '/gallary/img29.jpeg', text: 'Elegant Lodges in Snow-Capped Mountains' },
    { image: '/gallary/img30.jpeg', text: 'Tranquil Bungalows on Private Islands' },
    { image: '/gallary/img31.jpeg', text: 'Luxury Camping in Starlit Deserts' },
    { image: '/gallary/img32.jpeg', text: 'Exclusive Resorts in Untouched Valleys' },
    { image: '/gallary/img33.jpeg', text: 'Peaceful Retreats Overlooking Misty Fjords' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<number | null>(null);

  const startSlideShow = () => {
    slideInterval.current = window.setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
    }, 5000);
  };

  useEffect(() => {
    startSlideShow();
    return () => {
      if (slideInterval.current) window.clearInterval(slideInterval.current);
    };
  }, []);

  const [activeTab, setActiveTab] = useState('all');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
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
      <section className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Parallax
              bgImage={bannerImages[currentSlide].image}
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
                    {bannerImages[currentSlide].text}
                  </motion.h1>
                  <div className="flex justify-center space-x-4">
                    <motion.a
                      href="tel:+919443222997"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-orange-950 text-white px-6 py-3 rounded-full hover:bg-orange-900 transition duration-300 flex items-center"
                    >
                      <FaPhone className="mr-2" /> Call Now
                    </motion.a>
                    <motion.a
                      href="https://wa.me/+919443222997"
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300 flex items-center"
                    >
                      <FaWhatsapp className="mr-2" /> WhatsApp
                    </motion.a>
                  </div>
                </div>
              </div>
            </Parallax>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard icon={<FaSearch />} title="Room Search" description="Find your perfect room" />
            <ServiceCard icon={<FaConciergeBell />} title="Concierge" description="24/7 personalized service" />
            <ServiceCard icon={<FaSpa />} title="Spa & Wellness" description="Relax and rejuvenate" />
            <ServiceCard icon={<FaUtensils />} title="Fine Dining" description="Exquisite culinary experiences" />
          </div>
        </div>
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
            <h2 className="text-3xl font-bold mb-6">Available Rooms</h2>
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

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center flex flex-col items-center">
    <div className="text-4xl text-orange-950 mb-4 flex justify-center items-center h-16 w-16 rounded-full">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);


export default HomePage;





import React, { useState, useRef, lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRoom } from '../services/api';
import BookingForm from '../components/BookingForm';
import { FaBed, FaUsers, FaWifi, FaTv, FaParking, FaCoffee, FaSwimmingPool, FaStar, FaShare, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './carousel.css';


const LazyImage = lazy(() => import('../components/LazyImage'));

const images = [
  '/images/rooms/gallary/image1.png',
  '/images/rooms/gallary/image2.png',
  '/images/rooms/gallary/image3.png',
  '/images/rooms/gallary/image4.png',
  '/images/rooms/gallary/image5.png',
  '/images/rooms/gallary/image6.png',
  '/images/rooms/gallary/image7.png',
  '/images/rooms/gallary/image8.png',
  '/images/rooms/gallary/image9.png',
];

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gray-300 mb-4"></div>
    <div className="h-16 bg-gray-300 mb-4"></div>
    <div className="h-64 bg-gray-300 mb-4"></div>
    <div className="h-96 bg-gray-300"></div>
  </div>
);

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-gray-600"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  const { data: room, isLoading, error } = useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoom(id!),
  });

  useEffect(() => {
    const handleScroll = () => {
      if (bookingFormRef.current) {
        const rect = bookingFormRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBookingForm = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${room?.type} Room ${room?.number}`,
          text: `Check out this amazing ${room?.type} room at our hotel!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading room details</div>;
  if (!room) return <div className="text-center mt-8">Room not found</div>;

  const amenityIcons = {
    wifi: <FaWifi />,
    tv: <FaTv />,
    parking: <FaParking />,
    coffee: <FaCoffee />,
    pool: <FaSwimmingPool />
  };

  const tabs = ['details', 'amenities', 'policies'];

  const faqs = [
    {
      question: "What time is check-in and check-out?",
      answer: "Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability."
    },
    {
      question: "Is breakfast included in the room rate?",
      answer: "Breakfast is not included in the standard room rate. However, we offer a delicious breakfast buffet at our restaurant for an additional charge."
    },
    {
      question: "Is parking available?",
      answer: "Yes, we offer complimentary parking for all our guests. Valet parking is also available for an additional fee."
    },
    {
      question: "Are pets allowed?",
      answer: "We welcome pets in designated pet-friendly rooms. There is an additional pet fee per stay. Please inform us in advance if you plan to bring a pet."
    }
  ];

  return (
    <div className="bg-gray-100">
      <AnimatedSection>
        <Slider {...carouselSettings} className="h-96">
          
          {images.map((image, index) => (
            <div key={index} className="h-96 relative">
              <Suspense fallback={<div className="h-full w-full bg-gray-300"></div>}>
              <LazyImage
        src={image}
        alt={`Room thumbnail ${index + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
              </Suspense>
              <div className="absolute flex items-end">
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-4xl font-bold text-white mb-2">{room.type} Room {room.number}</h1>
                  <div className="flex items-center text-yellow-400">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    <span className="ml-2 text-white">(4.8/5 based on 120 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </AnimatedSection>

      <AnimatedSection>
        <div className="sticky top-0 bg-white shadow-md z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-950">${room.price}<span className="text-sm font-normal">/night</span></div>
            <div className="flex space-x-4">
              <button onClick={handleShare} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center">
                <FaShare className="mr-2" /> Share
              </button>
              <button onClick={scrollToBookingForm} className="bg-orange-950 text-white px-6 py-2 rounded-full hover:bg-orange-900 transition duration-300">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="mb-8">
            <div className="flex flex-wrap border-b border-gray-300">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all duration-300 relative flex-grow sm:flex-grow-0 ${
                    activeTab === tab
                      ? 'text-orange-950'
                      : 'text-gray-600 hover:text-orange-950'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-950"
                      layoutId="underline"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            {activeTab === 'details' && (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaBed className="text-orange-950 mr-2" />
                    <span>{room.capacity} {room.capacity > 1 ? 'beds' : 'bed'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-orange-950 mr-2" />
                    <span>Max {room.capacity} guests</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'amenities' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center">
                    <span className="text-orange-950 mr-2">{amenityIcons[amenity as keyof typeof amenityIcons]}</span>
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'policies' && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Cancellation Policy</h3>
                <p>Free cancellation up to 24 hours before check-in. After that, cancellation will incur a fee equivalent to the first night's stay.</p>
              </div>
            )}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div ref={bookingFormRef} className={`mt-8 bg-white shadow-lg rounded-lg p-6 ${isSticky ? 'sticky top-20 z-10' : ''}`}>
            <h2 className="text-2xl font-bold mb-4">Book This Room</h2>
           
            <BookingForm roomId={room._id} price={room.price} />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default RoomDetails;

import React, { useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRoom } from '../services/api';
import RoomGallery from '../components/RoomGallery';
import BookingForm from '../components/BookingForm';
import { FaBed, FaUsers, FaWifi, FaTv, FaParking, FaCoffee, FaSwimmingPool, FaStar } from 'react-icons/fa';

const images = [
  '../images/rooms/gallary/image1.png',
'../images/rooms/gallary/image2.png',
'../images/rooms/gallary/image3.png',
'../images/rooms/gallary/image4.png',
'../images/rooms/gallary/image5.png',
'../images/rooms/gallary/image6.png',
'../images/rooms/gallary/image7.png',
'../images/rooms/gallary/image8.png',
'../images/rooms/gallary/image9.png',
]


const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const { data: room, isLoading, error } = useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoom(id!),
  });

  const scrollToBookingForm = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <div className="text-center mt-8">Loading room details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading room details</div>;
  if (!room) return <div className="text-center mt-8">Room not found</div>;

  const amenityIcons = {
    wifi: <FaWifi />,
    tv: <FaTv />,
    parking: <FaParking />,
    coffee: <FaCoffee />,
    pool: <FaSwimmingPool />
  };

  return (
    <div className="bg-gray-100">
      <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(/images/rooms/${room.type.toLowerCase()}.png)` }}>
        <div className="bg-black bg-opacity-50 h-full flex items-end">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">{room.type} Room {room.number}</h1>
            <div className="flex items-center text-yellow-400">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              <span className="ml-2 text-white">(4.8/5 based on 120 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-950">${room.price}<span className="text-sm font-normal">/night</span></div>
          <button onClick={scrollToBookingForm} className="bg-orange-950 text-white px-6 py-2 rounded-full hover:bg-orange-900 transition duration-300">Book Now</button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex mb-8">
          {['details', 'amenities', 'policies'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? 'bg-orange-950 text-white' : 'bg-gray-200'} rounded-t-lg`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
        </div>

        

        <RoomGallery images={images} />

        <div ref={bookingFormRef} className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Book This Room</h2>
          <BookingForm roomId={room._id} price={room.price} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

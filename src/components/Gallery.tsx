import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const images = [
  '/images/rooms/gallary/image1.png',
  '/images/rooms/gallary/image1.png',
  '/images/gallery/image3.jpg',
  '/images/gallery/image4.jpg',
  '/images/gallery/image5.jpg',
  '/images/gallery/image6.jpg',
];

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev! - 1));

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-8 text-center text-orange-950">Explore Our Hotel</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <motion.div
            key={src}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg"
            onClick={() => openLightbox(index)}
          >
            <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-64 object-cover" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <button className="absolute top-4 right-4 text-white" onClick={closeLightbox}>
              <FaTimes size={24} />
            </button>
            <button className="absolute left-4 text-white" onClick={prevImage}>
              <FaArrowLeft size={24} />
            </button>
            <button className="absolute right-4 text-white" onClick={nextImage}>
              <FaArrowRight size={24} />
            </button>
            <img
              src={images[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              className="max-h-90vh max-w-90vw object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
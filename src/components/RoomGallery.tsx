import React from 'react';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface RoomGalleryProps {
  images: string[];
}

const RoomGallery: React.FC<RoomGalleryProps> = ({ images }) => {
// breakpointColumnsObj is an object containing the settings for your breakpoint
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Room Gallery</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map((imagePath, index) => (
          <motion.div
            key={index}
            className="mb-4 overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Zoom>
              <img
                src={`/${imagePath}`}
                alt={`Room image ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </Zoom>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
};

export default RoomGallery;

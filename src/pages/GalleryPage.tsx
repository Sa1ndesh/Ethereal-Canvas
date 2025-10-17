import React from 'react';
import { motion } from 'framer-motion';
import Gallery from '../components/Gallery';

const GalleryPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <Gallery />
    </motion.div>
  );
};

export default GalleryPage;

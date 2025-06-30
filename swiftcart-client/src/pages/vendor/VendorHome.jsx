import ImageCarousel from '../../components/Carousel';
import { motion } from 'framer-motion';

export default function VendorHome() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Animated  Text */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-extrabold text-center mt-10 mb-6 bg-gradient-to-r from-black via-red-700 to-black text-transparent bg-clip-text drop-shadow-md"
      >
        Welcome to Vendor Dashboard
      </motion.h1>

      {/* Full Screen Carousel */}
      <ImageCarousel />
    </div>
  );
}

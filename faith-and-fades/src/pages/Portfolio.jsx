import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function Portfolio() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  // Portfolio items - using placeholder images for now
  // You can replace these with your actual haircut photos
  const portfolioItems = [
    {
      id: 1,
      title: 'Classic Fade',
      category: 'fades',
      description: 'Clean mid fade with textured top',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80',
    },
    {
      id: 2,
      title: 'Curly Top Fade',
      category: 'fades',
      description: 'Low fade with natural curls',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80',
    },
    {
      id: 3,
      title: 'Buzz Cut',
      category: 'short',
      description: 'Classic all-over buzz cut',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80',
    },
    {
      id: 4,
      title: 'Textured Crop',
      category: 'short',
      description: 'Modern textured crop style',
      image: 'https://images.unsplash.com/photo-1634302086887-13b5281d6a08?w=800&q=80',
    },
    {
      id: 5,
      title: 'Beard Trim',
      category: 'beard',
      description: 'Shaped beard with lineup',
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
    },
    {
      id: 6,
      title: 'High Fade',
      category: 'fades',
      description: 'High skin fade with waves',
      image: 'https://images.unsplash.com/photo-1593702295094-aea1fae3a6a5?w=800&q=80',
    },
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'fades', label: 'Fades' },
    { key: 'short', label: 'Short Cuts' },
    { key: 'beard', label: 'Beard Work' },
  ];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold mb-4"
          >
            Portfolio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            A showcase of precision cuts and styles
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === f.key
                    ? 'bg-barber-gold text-barber-dark'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/5]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-serif text-xl font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Note about actual photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-8 bg-white rounded-xl shadow-lg"
          >
            <h3 className="font-serif text-2xl font-semibold mb-4">Your Photos Here</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These are placeholder images. Once you provide your actual haircut photos, 
              I'll replace them with your work to showcase your skills to potential clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-barber-gold transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white hover:text-barber-gold transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white hover:text-barber-gold transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl max-h-[80vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[selectedImage].image}
                alt={filteredItems[selectedImage].title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="text-center text-white mt-4">
                <h3 className="font-serif text-2xl font-semibold">
                  {filteredItems[selectedImage].title}
                </h3>
                <p className="text-gray-300">
                  {filteredItems[selectedImage].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Portfolio;

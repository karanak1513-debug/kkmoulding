import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeGallery, subscribeCategories } from '../firebase/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catQuery = searchParams.get('category');

  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(catQuery || 'All');
  
  // Lightbox State
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    const unsubGallery = subscribeGallery((data) => {
      setGallery(data);
    });
    const unsubCategories = subscribeCategories((data) => {
      setCategories(data);
    });

    return () => {
      unsubGallery();
      unsubCategories();
    };
  }, []);

  useEffect(() => {
    if (catQuery) {
      setSelectedCategory(catQuery);
    } else {
      setSelectedCategory('All');
    }
  }, [catQuery]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryName });
    }
  };

  const filteredGallery = gallery.filter((img) => {
    return selectedCategory === 'All' || img.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const nextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % filteredGallery.length);
  };

  const prevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      {/* Page Header */}
      <section className="relative bg-brand-dark py-16 text-center text-white" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(47, 37, 25, 0.9), rgba(47, 37, 25, 0.85)), url('https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold">Design Gallery</h1>
          <p className="mt-3 text-brand-beige/80 text-sm max-w-md mx-auto">
            Get design inspiration from real-world installation projects using our moldings and fluted panel designs.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-wrap justify-center gap-2 border-b border-brand-wood/10 pb-6 mb-12">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-brand-wood text-white shadow'
                : 'bg-white border border-brand-wood/20 text-brand-dark hover:bg-brand-beige/40'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-brand-wood text-white shadow'
                  : 'bg-white border border-brand-wood/20 text-brand-dark hover:bg-brand-beige/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-brand-wood/10 max-w-md mx-auto">
            <p className="font-serif text-lg text-brand-dark font-medium">No Gallery Images</p>
            <p className="text-sm text-brand-dark/60 mt-2">We haven't uploaded installation photos for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setActiveImageIndex(idx)}
                className="group relative h-72 rounded-xl overflow-hidden shadow-sm border border-brand-wood/10 cursor-pointer bg-white"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 z-10">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-brand-wood/80 text-white">
                      <Eye size={16} />
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-base font-bold text-white mt-0.5">
                      {item.title || "Wooden Moulding Application"}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
            {/* Close */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 z-20 rounded-full p-2.5 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <X size={24} />
            </button>

            {/* Left Nav */}
            <button
              onClick={prevImage}
              className="absolute left-6 z-20 rounded-full p-3 bg-zinc-900/60 text-white hover:bg-zinc-800/80 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Nav */}
            <button
              onClick={nextImage}
              className="absolute right-6 z-20 rounded-full p-3 bg-zinc-900/60 text-white hover:bg-zinc-800/80 transition-all"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image display */}
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[80vh] max-w-full z-10 flex flex-col items-center"
            >
              <img
                src={filteredGallery[activeImageIndex].imageUrl}
                alt={filteredGallery[activeImageIndex].title}
                className="max-h-[75vh] object-contain rounded"
              />
              <div className="mt-4 text-center">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-gold">
                  {filteredGallery[activeImageIndex].category}
                </span>
                <h3 className="font-serif text-lg font-semibold text-white mt-1">
                  {filteredGallery[activeImageIndex].title || "Wooden Moulding Application"}
                </h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

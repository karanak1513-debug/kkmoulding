import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Search, Phone, MessageCircle, FileText, X, Eye, Columns } from 'lucide-react';
import { subscribeProducts, subscribeCategories } from '../firebase/db';
import { BUSINESS_DETAILS } from '../constants';
import InquiryForm from '../components/InquiryForm';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

export default function Products() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryQuery = searchParams.get('category');
  
  const parseSlug = (slug) => slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'All';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug ? parseSlug(categorySlug) : (selectedCategoryQuery || 'All'));
  
  // Modal State
  const [activeProduct, setActiveProduct] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  useEffect(() => {
    const unsubProducts = subscribeProducts((data) => {
      setProducts(data);
    });
    const unsubCategories = subscribeCategories((data) => {
      setCategories(data);
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Update category when URL param or query param changes
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(parseSlug(categorySlug));
    } else if (selectedCategoryQuery) {
      setSelectedCategory(selectedCategoryQuery);
    } else {
      setSelectedCategory('All');
    }
  }, [categorySlug, selectedCategoryQuery]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All') {
      navigate('/products');
    } else {
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
      navigate(`/products/${slug}`);
    }
  };

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                            product.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const seoTitle = selectedCategory === 'All' 
    ? 'Premium Wooden Products | K K Moulding Delhi'
    : `${selectedCategory} | K K Moulding Delhi`;
    
  const seoDescription = selectedCategory === 'All'
    ? 'Browse our complete catalog of premium wooden moulding, doors, and interior wood products in Kirti Nagar, Delhi.'
    : `Explore our premium ${selectedCategory} collection. Manufactured at our Kirti Nagar, Delhi facility using high-quality materials.`;

  const productSchemaList = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredProducts.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "description": p.description || seoDescription,
        "image": p.mainImage || "https://www.kkmoulding.com/og-image.jpg",
        "category": p.category,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "INR"
        }
      }
    }))
  });

  return (
    <>
    <SEO 
      title={seoTitle}
      description={seoDescription}
      url={`https://www.kkmoulding.com/products${categorySlug ? `/${categorySlug}` : ''}`}
      schema={productSchemaList}
    />
    <div className="bg-brand-light min-h-screen pb-24">
      {/* Page Header */}
      <section className="relative bg-brand-dark py-16 text-center text-white" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(47, 37, 25, 0.9), rgba(47, 37, 25, 0.85)), url('https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold">Our Products</h1>
          <p className="mt-3 text-brand-beige/80 text-sm max-w-md mx-auto">
            Browse through our wide range of premium moldings, panels, and wooden decorative accessories.
          </p>
        </div>
      </section>

      {/* Main Catalog Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ── Left Sidebar Filters ───────────────────────────────────── */}
          <div className="space-y-5">

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Search Products</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, spec..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-4 text-sm text-stone-800 outline-none focus:border-brand-wood focus:bg-white focus:ring-2 focus:ring-brand-wood/10 transition-all"
                />
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter — Desktop: vertical list */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hidden lg:block">
              <div className="px-5 py-4 border-b border-stone-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Categories</p>
              </div>
              <div className="py-2">
                {/* All Products */}
                <button
                  onClick={() => handleCategorySelect('All')}
                  className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-all duration-200 group ${
                    selectedCategory === 'All'
                      ? 'bg-brand-wood/5 border-l-[3px] border-brand-wood text-brand-wood font-bold'
                      : 'border-l-[3px] border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-800 font-medium'
                  }`}
                >
                  <span>All Products</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    selectedCategory === 'All' ? 'bg-brand-wood/10 text-brand-wood' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'
                  }`}>{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const count = products.filter(p => p.category?.toLowerCase() === cat.name?.toLowerCase()).length;
                  const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-all duration-200 group ${
                        isActive
                          ? 'bg-brand-wood/5 border-l-[3px] border-brand-wood text-brand-wood font-bold'
                          : 'border-l-[3px] border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-800 font-medium'
                      }`}
                    >
                      <span className="text-left leading-snug">{cat.name}</span>
                      <span className={`ml-2 shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive ? 'bg-brand-wood/10 text-brand-wood' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter — Mobile: horizontal scrollable chips */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => handleCategorySelect('All')}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 border ${
                    selectedCategory === 'All'
                      ? 'bg-brand-wood text-white border-brand-wood shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-brand-wood/50'
                  }`}
                >All</button>
                {categories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 border whitespace-nowrap ${
                        isActive
                          ? 'bg-brand-wood text-white border-brand-wood shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-brand-wood/50'
                      }`}
                    >{cat.name}</button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-brand-wood/10">
                <p className="font-serif text-lg text-brand-dark font-medium">No Products Found</p>
                <p className="text-sm text-brand-dark/60 mt-2">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setSearchTerm(''); handleCategorySelect('All'); }}
                  className="mt-6 rounded-full bg-brand-wood px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => { setActiveProduct(product); setShowInquiryForm(false); }}
                    className="group bg-white rounded-xl shadow-sm border border-brand-wood/10 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image wrapper */}
                      <div className="h-56 bg-brand-beige/20 overflow-hidden relative">
                        <img
                          src={product.mainImage || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80'}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="flex items-center gap-1 text-white font-semibold text-xs tracking-wider uppercase bg-brand-wood/90 px-4 py-2 rounded-full shadow-md">
                            <Eye size={14} /> Quick View
                          </span>
                        </div>
                        {product.featured && (
                          <span className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Info Panel */}
                      <div className="p-5">
                        <span className="text-[10px] tracking-widest font-semibold uppercase text-brand-wood/75">
                          {product.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-brand-dark mt-1 hover:text-brand-wood transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-brand-dark/70 mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Quick inquiry triggers */}
                    <div className="border-t border-brand-wood/10 p-4 bg-brand-light/30 flex gap-2">
                      <a
                        href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20am%20interested%20in%20ordering%20bulk%20quote%20for%20${encodeURIComponent(product.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all"
                        title="WhatsApp Inquiry"
                      >
                        <MessageCircle size={16} />
                      </a>
                      <a
                        href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center p-2 rounded-lg bg-brand-wood text-white hover:bg-brand-dark transition-all"
                        title="Call Now"
                      >
                        <Phone size={16} />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProduct(product);
                          setShowInquiryForm(true);
                        }}
                        className="flex-1 flex items-center justify-center p-2 rounded-lg border border-brand-wood/20 hover:bg-brand-beige/35 text-brand-dark text-xs font-semibold"
                        title="Get Bulk Quote"
                      >
                        <FileText size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl z-10 border border-brand-wood/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 z-20 rounded-full p-2 bg-brand-light text-brand-dark hover:bg-brand-beige/50"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
                
                {/* Images column */}
                <div className="space-y-4">
                  <div className="h-80 bg-brand-light rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={activeProduct.mainImage}
                      alt={activeProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {activeProduct.galleryImages && activeProduct.galleryImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {activeProduct.galleryImages.map((img, idx) => (
                        <div key={idx} className="h-20 bg-brand-light rounded-lg overflow-hidden border border-brand-wood/10">
                          <img src={img} alt={`${activeProduct.name} detail view`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details column */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xs tracking-widest font-semibold uppercase text-brand-wood">
                      {activeProduct.category}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
                      {activeProduct.name}
                    </h2>
                    
                    <p className="text-sm text-brand-dark/70 mt-4 leading-relaxed">
                      {activeProduct.description}
                    </p>

                    {/* Spec table */}
                    {activeProduct.specs && Object.keys(activeProduct.specs).length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xs uppercase font-semibold tracking-wider text-brand-wood border-b border-brand-wood/10 pb-2 mb-3">
                          Specifications
                        </h4>
                        <table className="w-full text-xs text-left border-collapse">
                          <tbody>
                            {Object.entries(activeProduct.specs).map(([key, value]) => (
                              <tr key={key} className="border-b border-brand-wood/5">
                                <td className="py-2 font-semibold text-brand-dark/70 w-1/3">{key}</td>
                                <td className="py-2 text-brand-dark/95">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {!showInquiryForm ? (
                    <div className="mt-8 space-y-3 pt-6 border-t border-brand-wood/10">
                      <div className="flex gap-4">
                        <a
                          href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20have%20an%20inquiry%20regarding%20${encodeURIComponent(activeProduct.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#20ba5a]"
                        >
                          <MessageCircle size={16} />
                          <span>WhatsApp Enquiry</span>
                        </a>

                        <a
                          href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-wood py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
                        >
                          <Phone size={16} />
                          <span>Call Shop</span>
                        </a>
                      </div>

                      <button
                        onClick={() => setShowInquiryForm(true)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-brand-wood/30 py-3 text-sm font-semibold text-brand-wood hover:bg-brand-beige/25 transition-colors"
                      >
                        <FileText size={16} />
                        <span>Request Custom Bulk Quote</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 pt-6 border-t border-brand-wood/10">
                      <InquiryForm
                        prefillProduct={activeProduct.name}
                        onCancel={() => setShowInquiryForm(false)}
                      />
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </>
  );
}

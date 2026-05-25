import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, FileText, ArrowRight, Award, Ruler, Settings, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { subscribeProducts, subscribeCategories, subscribeTestimonials, subscribeGallery, subscribePageContent } from '../firebase/db';
import { BUSINESS_DETAILS } from '../constants';
import InquiryForm from '../components/InquiryForm';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Subscriptions for real-time sync
    const unsubProducts = subscribeProducts((data) => {
      setProducts(data.filter(p => p.featured).slice(0, 4));
    });
    const unsubCategories = subscribeCategories((data) => {
      setCategories(data.slice(0, 4));
    });
    const unsubTestimonials = subscribeTestimonials((data) => {
      setTestimonials(data.slice(0, 3));
    });
    const unsubGallery = subscribeGallery((data) => {
      setGallery(data.slice(0, 4));
    });
    const unsubPageContent = subscribePageContent('home', (data) => {
      setContent(data);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubTestimonials();
      unsubGallery();
      unsubPageContent();
    };
  }, []);

  const handleScrollToQuote = (e) => {
    e.preventDefault();
    const element = document.getElementById('inquiry-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const localBusinessSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "K K Moulding",
    "image": "https://kkmoulding.com/og-image.jpg",
    "description": "Premium wooden moulding, wooden doors, wooden chaukat, HDMR products, and custom wooden interior solutions in Kirti Nagar Delhi.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "B-116, Timber Block, Kirti Nagar",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110015",
      "addressCountry": "IN"
    },
    "telephone": BUSINESS_DETAILS.phone,
    "url": "https://kkmoulding.com",
    "openingHours": "Mo,Tu,We,Th,Fr,Sa 10:00-19:30"
  });

  return (
    <>
    <SEO />
    <Helmet>
      <script type="application/ld+json">{localBusinessSchema}</script>
    </Helmet>
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center py-20" style={{
        backgroundImage: `linear-gradient(to right, rgba(47, 37, 25, 0.85), rgba(47, 37, 25, 0.45)), url('${content?.hero?.backgroundImage || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80"}')`
      }}>
        <div className="absolute inset-0 bg-brand-dark/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full bg-brand-gold/20 border border-brand-gold/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold mb-6"
          >
            {content?.hero?.tag || "Kirti Nagar, Delhi • Direct Manufacturer"}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto"
          >
            {content?.hero?.title || "Premium Wooden Moulding & Interior Solutions"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-brand-beige/90 max-w-2xl mx-auto font-light"
          >
            {content?.hero?.subtitle || "Bulk Orders | Custom Designs | High Quality Finish"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none"
          >
            <a
              href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-brand-wood px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-brand-gold hover:shadow-brand-gold/20 hover:-translate-y-0.5"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>

            <a
              href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20want%20to%20inquire%20about%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#20ba5a] hover:shadow-emerald-500/20 hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              <span>WhatsApp Us</span>
            </a>

            <a
              href="#inquiry-section"
              onClick={handleScrollToQuote}
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-transparent border border-white/40 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-brand-dark hover:-translate-y-0.5"
            >
              <FileText size={18} />
              <span>Get Bulk Quote</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES */}
      <section className="py-24 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-4">
              Explore Our Categories
            </h2>
            <div className="h-[2px] w-24 bg-brand-gold mx-auto mb-6"></div>
            <p className="text-brand-dark/70">
              We design and craft custom solutions in various categories to match your architectural requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: "wooden-moulding",
                title: "Wooden Moulding",
                img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
                desc: "Premium Burma Teak & Hardwoods"
              },
              {
                id: "wooden-chaukat",
                title: "Wooden Chaukat",
                img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                desc: "Durable door & window frames"
              },
              {
                id: "wooden-doors",
                title: "Wooden Doors",
                img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
                desc: "Premium entryways & designer doors"
              },
              {
                id: "hdmr-products",
                title: "HDMR Products",
                img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
                desc: "Moisture-resistant panels & trims"
              }
            ].map((cat, idx) => (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative h-96 overflow-hidden rounded-xl shadow-md bg-white border border-brand-wood/10"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent z-10"></div>
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">{cat.desc}</span>
                  <h3 className="font-serif text-xl font-bold text-white mt-1 mb-3">{cat.title}</h3>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.title)}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-brand-gold transition-colors duration-300"
                  >
                    <span>View Products</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-brand-wood/40 px-8 py-3.5 text-sm font-semibold text-brand-wood hover:bg-brand-wood hover:text-white transition-all duration-300"
            >
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SNIPPET */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-brand-beige/50 rounded-2xl -z-10"></div>
              <img
                src={content?.aboutSnippet?.image || "/about-logo.jpg"}
                alt="KK Moulding craftsmanship"
                className="rounded-2xl shadow-xl w-full object-cover h-[450px]"
              />
              <div className="absolute bottom-6 right-6 bg-brand-wood text-white px-6 py-4 rounded-xl shadow-md border border-brand-gold/30">
                <p className="font-serif text-3xl font-bold">{content?.aboutSnippet?.yearsOfExperience || "15+"}</p>
                <p className="text-xs uppercase tracking-widest text-brand-beige/80">Years Experience</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{content?.aboutSnippet?.tag || "Crafting Perfection"}</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-6">
                {content?.aboutSnippet?.title || "15+ Years of Fine Wooden Artistry in Delhi"}
              </h2>
              <p className="text-brand-dark/70 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content?.aboutSnippet?.paragraph1 || "At <strong>K K Moulding</strong>, we bring over 15 years of experience in premium wooden craftsmanship and interior decorative solutions. Based in Kirti Nagar, Delhi, we specialize in wooden moulding, wooden chaukat, designer doors, HDMR products, decorative panels, and custom wooden interior work." }}></p>
              <p className="text-brand-dark/70 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content?.aboutSnippet?.paragraph2 || "Our commitment to quality, precision, and modern design has helped us build a strong reputation in the wooden interior industry. Every product is crafted using premium materials, advanced manufacturing techniques, and skilled craftsmanship to deliver durability, elegance, and superior finishing." }}></p>
              <p className="text-brand-dark/70 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content?.aboutSnippet?.paragraph3 || "We proudly serve residential, commercial, showroom, office, and interior projects with bulk supply and customized wooden solutions tailored to client requirements." }}></p>
              <p className="text-brand-dark/70 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: content?.aboutSnippet?.paragraph4 || "With a legacy of trust, craftsmanship, and innovation, K K Moulding continues to create timeless wooden interiors that reflect perfection and style." }}></p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-wood px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand-dark transition-all duration-300"
                >
                  <span>Learn Our Story</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-wood/30 px-7 py-3.5 text-sm font-semibold text-brand-wood hover:bg-brand-beige/20 transition-all duration-300"
                >
                  <span>Talk to Expert</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-brand-beige/30 border-y border-brand-wood/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Our Advantage</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-4">
              Why Professionals Choose K K Moulding
            </h2>
            <div className="h-[2px] w-24 bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8 text-brand-wood" />,
                title: "Premium Grade Woods",
                desc: "We use high-quality Burma Teak, solid wood, and moisture-resistant HDMR boards."
              },
              {
                icon: <Ruler className="h-8 w-8 text-brand-wood" />,
                title: "Precision Engineering",
                desc: "Equipped with modern CNC routers and milling cutters for flawless, uniform patterns."
              },
              {
                icon: <Settings className="h-8 w-8 text-brand-wood" />,
                title: "Bespoke Customization",
                desc: "Provide custom designs based on blueprints or CAD files provided by architects."
              },
              {
                icon: <Truck className="h-8 w-8 text-brand-wood" />,
                title: "Direct Wholesale Rates",
                desc: "As manufacturers, we offer competitive factory prices for bulk commercial orders."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-brand-wood/10 hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-5 inline-block p-3 rounded-lg bg-brand-beige/50">{feature.icon}</div>
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-3">{feature.title}</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-brand-light">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Reviews</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-4">
                What Architects & Decorators Say
              </h2>
              <div className="h-[2px] w-24 bg-brand-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.id || idx}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-brand-wood/10 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-brand-dark/80 italic text-sm leading-relaxed mb-6">
                      "{t.review}"
                    </p>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-brand-dark">{t.name}</h4>
                    <p className="text-xs uppercase tracking-wider text-brand-wood mt-0.5">{t.designation || 'Client'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. INQUIRY FORM SECTION */}
      <section id="inquiry-section" className="py-24 bg-white relative scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Bulk Order Enquiry</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-6">
                Ready to Start Your Custom Order?
              </h2>
              <p className="text-brand-dark/70 mb-6 leading-relaxed">
                Whether you need a thousand running feet of Pine wainscoting or a customized hand-milled ceiling frame, send us your details.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige text-brand-wood">
                    <Phone size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-brand-dark/60 font-semibold uppercase">Call Directly</p>
                    <a href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`} className="font-serif font-semibold text-brand-dark hover:text-brand-wood transition-colors">
                      {BUSINESS_DETAILS.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige text-brand-wood">
                    <MessageCircle size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-brand-dark/60 font-semibold uppercase">WhatsApp Chat</p>
                    <a
                      href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif font-semibold text-brand-dark hover:text-brand-wood transition-colors"
                    >
                      {BUSINESS_DETAILS.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="py-24 bg-brand-beige/10 border-t border-brand-wood/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Portfolio</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2">
                  Completed Interiors
                </h2>
              </div>
              <Link
                to="/gallery"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-full bg-brand-wood px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark transition-colors duration-300"
              >
                <span>Browse Full Gallery</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.map((img, idx) => (
                <div key={img.id || idx} className="group relative h-64 overflow-hidden rounded-xl shadow-sm border border-brand-wood/10">
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <p className="font-serif text-white font-semibold">{img.title || "Wooden Moulding Work"}</p>
                  </div>
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEW: FAQ & DECORATIVE MOULDING SOLUTIONS (SEO) */}
      <section className="py-24 bg-white border-t border-brand-wood/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Decorative Moulding Content */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Interior Design Applications</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-6">
                Decorative Moulding Solutions in Delhi
              </h2>
              <p className="text-brand-dark/70 leading-relaxed mb-4">
                As a leading <strong>decorative moulding manufacturer</strong> and <strong>PVC moulding supplier</strong> in Delhi NCR, K K Moulding provides comprehensive interior moulding solutions. Our products are ideal for luxury homes, commercial spaces, and architectural projects.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                  <span className="h-2 w-2 rounded-full bg-brand-wood"></span> Premium wooden patti supplier for wall paneling.
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                  <span className="h-2 w-2 rounded-full bg-brand-wood"></span> Custom door chaukat manufacturer for robust entryways.
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                  <span className="h-2 w-2 rounded-full bg-brand-wood"></span> Elegant wooden frame manufacturer serving Kirti Nagar.
                </li>
              </ul>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-brand-wood/40 px-6 py-2.5 text-sm font-semibold text-brand-wood hover:bg-brand-wood hover:text-white transition-all duration-300"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* FAQ */}
            <div className="bg-brand-beige/20 p-8 rounded-2xl border border-brand-wood/10">
              <h3 className="font-serif text-2xl font-bold text-brand-dark mb-6">Frequently Asked Questions</h3>
              
              <div className="mb-6">
                <h4 className="font-bold text-brand-dark mb-2">Where is K K Moulding located?</h4>
                <p className="text-sm text-brand-dark/70">We are a prominent wooden moulding manufacturer located at B-116, Timber Block, Kirti Nagar, New Delhi, serving clients across India.</p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-bold text-brand-dark mb-2">Do you accept custom bulk orders?</h4>
                <p className="text-sm text-brand-dark/70">Yes, we specialize in bulk and custom wooden interior orders for architects, builders, and decorators. We are a trusted door chaukat manufacturer for large projects.</p>
              </div>

              <div>
                <h4 className="font-bold text-brand-dark mb-2">What materials do you use?</h4>
                <p className="text-sm text-brand-dark/70">We use premium hardwoods, Burma teak, and high-density moisture-resistant (HDMR) materials for all our decorative moulding solutions.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. GOOGLE MAP SECTION */}
      <section className="w-full h-[450px] relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.127885068212!2d77.1293306!3d28.6558838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0392d42df7cf%3A0xe54fb72ca35ad7eb!2sB-116%2C%20Timber%20Block%2C%20Kirti%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110015!5e0!3m2!1sen!2sin!4v1716382103498!5m2!1sen!2sin"
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen=""
          loading="lazy"
          title="K K Moulding Location - Kirti Nagar, Delhi"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
    </>
  );
}

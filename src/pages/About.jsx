import React from 'react';
import { Award, ShieldCheck, Ruler, Settings, Compass, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { BUSINESS_DETAILS } from '../constants';
import SEO from '../components/SEO';

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <>
    <SEO 
      title="About Us | K K Moulding Delhi" 
      description="Learn about K K Moulding's 15+ year legacy in crafting premium wooden interiors, moulding, and HDMR products in Kirti Nagar, Delhi."
      url="https://kkmoulding.com/about"
    />
    <div className="bg-brand-light min-h-screen">
      {/* Page Header */}
      <section className="relative bg-brand-dark py-20 text-center text-white" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(47, 37, 25, 0.9), rgba(47, 37, 25, 0.8)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">About Us</h1>
          <p className="mt-4 text-brand-beige/85 text-sm sm:text-base tracking-wider uppercase">
            Crafting Premium Wooden Art Since 2011
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            className="lg:col-span-6"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Our Legacy</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-6">
              K K Moulding: Precision Woodcraft & Design
            </h2>
            <p className="text-brand-dark/70 leading-relaxed mb-6">
              <strong>K K Moulding</strong> is a premium wooden interior products company based in Kirti Nagar, Delhi, specializing in high-quality wooden moulding, wooden chaukat, wooden doors, HDMR products, decorative panels, and custom wooden interior solutions.
            </p>
            <p className="text-brand-dark/70 leading-relaxed mb-6">
              With a strong focus on craftsmanship, quality, and modern design, we provide durable and stylish wooden products for homes, offices, showrooms, hotels, and commercial projects. Our goal is to deliver premium finishing and elegant wooden solutions that enhance every interior space.
            </p>
            <div className="mb-6">
              <h3 className="font-serif text-xl text-brand-dark mb-3">We deal in:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-brand-dark/70 list-disc list-inside">
                <li>Wooden Moulding</li>
                <li>Wooden Chaukat</li>
                <li>Wooden Doors</li>
                <li>HDMR Products</li>
                <li>Decorative Wooden Panels</li>
                <li>Wall & Ceiling Designs</li>
                <li>Custom Wooden Work</li>
              </ul>
            </div>
            <p className="text-brand-dark/70 leading-relaxed">
              At K K Moulding, we believe in quality materials, precision work, modern designs, and customer satisfaction. We handle bulk orders, customized requirements, and interior decorative projects with professional service and timely delivery.
            </p>
          </motion.div>

          <motion.div 
            className="lg:col-span-6 grid grid-cols-2 gap-4"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
              alt="Wood carving detail"
              className="rounded-xl shadow-md h-64 w-full object-cover"
            />
            <div className="flex flex-col justify-end mt-8">
              <div className="bg-brand-wood/10 p-6 rounded-xl border border-brand-wood/20 mb-4 h-full flex flex-col justify-center">
                <h3 className="font-serif text-xl font-bold text-brand-dark mb-4">Why Choose Us</h3>
                <ul className="space-y-2 text-sm text-brand-dark/80">
                  <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-wood" /> Premium Quality</li>
                  <li className="flex items-center gap-2"><Settings className="w-4 h-4 text-brand-wood" /> Modern Designs</li>
                  <li className="flex items-center gap-2"><Settings className="w-4 h-4 text-brand-wood" /> Bulk & Custom</li>
                  <li className="flex items-center gap-2"><Settings className="w-4 h-4 text-brand-wood" /> Timely Delivery</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24 bg-white border-y border-brand-wood/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Our Philosophy</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2">
              Values That Define Our Quality
            </h2>
            <div className="h-[2px] w-24 bg-brand-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Award className="h-10 w-10 text-brand-wood" />,
                title: "Selected Hardwoods Only",
                desc: "We source wood from certified sustainable forests, ensuring minimal knots and consistent grains for Teak and Pine moldings."
              },
              {
                icon: <Compass className="h-10 w-10 text-brand-wood" />,
                title: "Architectural Integrity",
                desc: "Every profile matches precise historical or contemporary blueprints, ensuring consistent depths and shadow lines."
              },
              {
                icon: <Landmark className="h-10 w-10 text-brand-wood" />,
                title: "Kirti Nagar Heritage",
                desc: "Operating from B-116 Timber Block, we are proud to support Delhi's historic timber craftsmanship and trade community."
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center bg-brand-light p-8 rounded-xl border border-brand-wood/10">
                <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-6">{item.icon}</div>
                <h3 className="font-serif text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Crafting Excellence</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mt-2 mb-4">
            Our Manufacturing Process
          </h2>
          <p className="text-brand-dark/70 leading-relaxed max-w-3xl">
            At K K Moulding, we follow a professional and quality-focused manufacturing process to create premium wooden interior products with excellent finishing and durability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            { step: "01", title: "Raw Material Selection", desc: "We carefully select high-quality wood, HDMR materials, and premium boards to ensure strength, durability, and long-lasting performance in every product." },
            { step: "02", title: "Design & Measurement", desc: "Our team works on modern designs, accurate measurements, and customized requirements according to customer needs and interior project specifications." },
            { step: "03", title: "Cutting & Shaping", desc: "Using advanced woodworking machines and skilled craftsmanship, materials are precisely cut and shaped for mouldings, doors, chaukat, panels, and decorative designs." },
            { step: "04", title: "Finishing & Detailing", desc: "Each product goes through detailed finishing, polishing, smooth edge treatment, and decorative work to achieve a premium modern look." },
            { step: "05", title: "Quality Inspection", desc: "Every product is checked for: Strength, Finishing quality, Design accuracy, Surface smoothness, and Durability standards." },
            { step: "06", title: "Packaging & Delivery", desc: "Products are safely packed and delivered for residential, commercial, showroom, hotel, and interior projects with proper handling and timely service." }
          ].map((proc, idx) => (
            <div key={idx} className="bg-brand-light p-8 rounded-xl border border-brand-wood/10 hover:shadow-md transition-shadow">
              <span className="font-serif text-4xl font-bold text-brand-gold/30">{proc.step}</span>
              <h4 className="font-serif font-semibold text-brand-dark text-xl mt-2 mb-3">{proc.title}</h4>
              <p className="text-sm text-brand-dark/70 leading-relaxed">{proc.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-6">How We Work</h2>
            <ul className="space-y-4 mb-8 text-brand-dark/80">
              {[
                "Customer Requirement Discussion",
                "Product Design & Selection",
                "Custom Size & Order Processing",
                "Manufacturing & Finishing",
                "Quality Checking",
                "Bulk Supply & Delivery"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-gold/20 text-brand-wood text-xs font-bold">{i + 1}</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            
            <p className="text-brand-dark/80 leading-relaxed font-medium bg-brand-beige/30 p-6 rounded-xl border border-brand-wood/20">
              Our focus is to provide premium quality wooden solutions with modern designs, professional service, and customer satisfaction.
            </p>
          </div>

          <div className="bg-brand-dark rounded-2xl p-8 sm:p-12 text-white" style={{
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-6 text-brand-gold">We specialize in:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-brand-beige/90 mb-10">
              <li className="flex items-center gap-2"><Settings size={16} className="text-brand-gold" /> Wooden Moulding</li>
              <li className="flex items-center gap-2"><Settings size={16} className="text-brand-gold" /> Wooden Chaukat</li>
              <li className="flex items-center gap-2"><Settings size={16} className="text-brand-gold" /> Wooden Doors</li>
              <li className="flex items-center gap-2"><Settings size={16} className="text-brand-gold" /> HDMR Products</li>
              <li className="flex items-center gap-2"><Settings size={16} className="text-brand-gold" /> Decorative Wooden Panels</li>
              <li className="flex items-center gap-2"><Settings size={16} className="text-brand-gold" /> Custom Wooden Interior Work</li>
            </ul>
            <div className="pt-8 border-t border-white/20">
              <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold mb-2">Bulk Orders & Custom Requirements</p>
              <a href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`} className="font-serif text-2xl sm:text-3xl font-bold hover:text-brand-gold transition-colors">
                {BUSINESS_DETAILS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

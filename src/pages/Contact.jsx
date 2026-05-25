import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, MessageSquare } from 'lucide-react';
import { BUSINESS_DETAILS } from '../constants';
import InquiryForm from '../components/InquiryForm';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

export default function Contact() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where is K K Moulding located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are located at B-116, Timber Block, Kirti Nagar, New Delhi, Delhi 110015."
        }
      },
      {
        "@type": "Question",
        "name": "Do you accept custom bulk orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in bulk and custom wooden interior orders for architects, builders, and decorators."
        }
      }
    ]
  });

  return (
    <>
    <SEO 
      title="Contact Us | K K Moulding Kirti Nagar Delhi"
      description="Contact K K Moulding for premium wooden doors, moulding, and custom interior products. Call us or visit our Kirti Nagar showroom."
      url="https://kkmoulding.com/contact"
    />
    <Helmet>
      <script type="application/ld+json">{faqSchema}</script>
    </Helmet>
    <div className="bg-brand-light min-h-screen">
      {/* Page Header */}
      <section className="relative bg-brand-dark py-16 text-center text-white" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(47, 37, 25, 0.9), rgba(47, 37, 25, 0.85)), url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-brand-beige/85 text-sm max-w-md mx-auto">
            Get in touch with K K Moulding for wholesale pricing, catalog requests, or custom woodwork orders.
          </p>
        </div>
      </section>

      {/* Contact Cards & Form */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Info Panels */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Get In Touch</span>
              <h2 className="font-serif text-3xl text-brand-dark mt-2 mb-4">
                Visit or Call Our Office
              </h2>
              <p className="text-sm text-brand-dark/70 leading-relaxed">
                Our main showroom is situated in Delhi's historic wood craftsmanship and timber trade market of Kirti Nagar. Drop by to examine samples and browse through physical catalogue patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address card */}
              <div className="bg-white p-6 rounded-xl border border-brand-wood/10 shadow-sm">
                <MapPin className="h-6 w-6 text-brand-wood mb-4" />
                <h3 className="font-serif font-bold text-brand-dark mb-1">Showroom Address</h3>
                <a
                  href={BUSINESS_DETAILS.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-dark/75 hover:text-brand-wood transition-colors leading-relaxed inline-flex items-center gap-0.5"
                >
                  <span>{BUSINESS_DETAILS.address}</span>
                  <ArrowUpRight size={12} className="shrink-0 text-brand-gold" />
                </a>
              </div>

              {/* Phone card */}
              <div className="bg-white p-6 rounded-xl border border-brand-wood/10 shadow-sm">
                <Phone className="h-6 w-6 text-brand-wood mb-4" />
                <h3 className="font-serif font-bold text-brand-dark mb-1">Phone Number</h3>
                <p className="text-xs text-brand-dark/65 mb-1">Call for pricing queries:</p>
                <a
                  href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
                  className="text-sm font-semibold text-brand-wood hover:text-brand-dark transition-colors"
                >
                  {BUSINESS_DETAILS.phone}
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-white p-6 rounded-xl border border-brand-wood/10 shadow-sm">
                <Mail className="h-6 w-6 text-brand-wood mb-4" />
                <h3 className="font-serif font-bold text-brand-dark mb-1">Email Address</h3>
                <p className="text-xs text-brand-dark/65 mb-1">Send your drawings:</p>
                <a
                  href={`mailto:${BUSINESS_DETAILS.email}`}
                  className="text-sm font-semibold text-brand-wood hover:text-brand-dark transition-colors"
                >
                  {BUSINESS_DETAILS.email}
                </a>
              </div>

              {/* Clock Card */}
              <div className="bg-white p-6 rounded-xl border border-brand-wood/10 shadow-sm">
                <Clock className="h-6 w-6 text-brand-wood mb-4" />
                <h3 className="font-serif font-bold text-brand-dark mb-1">Business Hours</h3>
                <p className="text-xs text-brand-dark/70 leading-relaxed">
                  Mon - Sat: 10:00 AM - 7:30 PM <br />
                  Sunday: Closed
                </p>
              </div>



            </div>

            <div className="bg-brand-beige/50 p-6 rounded-xl border border-brand-wood/20 flex gap-4 items-start">
              <MessageSquare className="h-6 w-6 text-brand-wood shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-brand-dark">Instant WhatsApp Chat</h4>
                <p className="text-xs text-brand-dark/70 mt-1 leading-relaxed">
                  Architects and contractors can click below to immediately send sketch images or specs directly to our support desk.
                </p>
                <a
                  href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20have%20an%20instant%20query.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#20ba5a]"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form Panel */}
          <motion.div
            className="lg:col-span-7"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <InquiryForm />
          </motion.div>

        </div>
      </section>

      {/* Google Map Section */}
      <section className="w-full h-[450px] relative border-t border-brand-wood/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.127885068212!2d77.1293306!3d28.6558838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0392d42df7cf%3A0xe54fb72ca35ad7eb!2sB-116%2C%20Timber%20Block%2C%20Kirti%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110015!5e0!3m2!1sen!2sin!4v1716382103498!5m2!1sen!2sin"
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen=""
          loading="lazy"
          title="K K Moulding Location Maps"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
    </>
  );
}

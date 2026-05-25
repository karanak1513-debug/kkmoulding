import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { BUSINESS_DETAILS } from '../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    "Wooden Moulding",
    "Wooden Chaukat",
    "Wooden Doors",
    "HDMR Products",
    "Decorative Wooden Panels",
    "Wall Moulding",
    "Ceiling Designs",
    "Interior Wooden Frames",
    "Custom Wooden Work",
    "All Types of Wooden Interior Products"
  ];

  return (
    <footer className="bg-brand-dark text-brand-beige border-t border-brand-wood/20 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <Link to="/" className="inline-block bg-white p-2 rounded-xl">
              <img src="/logo-white.png" alt="K K Moulding Logo" className="h-14 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm text-brand-beige/70 leading-relaxed">
              Premium manufacturer and supplier of wooden moulding, solid wood doors, chaukhat door frames, fluted HDMR boards, and all types of custom wooden interior products in Kirti Nagar, Delhi.
            </p>
            <div className="mt-6 flex items-center space-x-3 text-sm text-brand-gold">
              <Clock size={16} />
              <span>Mon - Sat: 10:00 AM - 7:30 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Our Products', path: '/products' },
                { name: 'Design Gallery', path: '/gallery' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-brand-beige/70 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide mb-6">
              Product Range
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-brand-beige/70 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location / Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide mb-6">
              Visit Showroom
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <a
                  href={BUSINESS_DETAILS.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-beige/70 hover:text-white transition-colors duration-300 leading-relaxed flex items-center gap-1"
                >
                  <span>{BUSINESS_DETAILS.address}</span>
                  <ArrowUpRight size={14} className="shrink-0 text-brand-gold" />
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <a
                  href={`tel:${BUSINESS_DETAILS.phone.replace(/\s+/g, '')}`}
                  className="text-sm text-brand-beige/70 hover:text-white transition-colors duration-300"
                >
                  {BUSINESS_DETAILS.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <a
                  href={`mailto:${BUSINESS_DETAILS.email}`}
                  className="text-sm text-brand-beige/70 hover:text-white transition-colors duration-300"
                >
                  {BUSINESS_DETAILS.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-wood/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-brand-beige/50">
          <p>© {currentYear} {BUSINESS_DETAILS.name}. All Rights Reserved.</p>
          <div className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
            <p>Handcrafted Premium Interior Moldings • Kirti Nagar, Delhi</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

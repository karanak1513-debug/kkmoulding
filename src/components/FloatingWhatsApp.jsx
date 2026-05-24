import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_DETAILS } from '../constants';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20am%20interested%20in%20your%20wooden%20moulding%20products.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[6rem] right-6 sm:bottom-[5rem] sm:right-6 z-40 flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 group hover:shadow-[#25D366]/30"
      aria-label="Contact on WhatsApp"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-sm font-semibold pr-0 group-hover:pr-2">
        Chat with us
      </span>
      <MessageCircle size={24} className="animate-pulse" />
    </a>
  );
}

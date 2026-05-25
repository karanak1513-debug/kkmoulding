import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { BUSINESS_DETAILS } from '../constants';

export default function FloatingButtons() {
  const whatsappUrl = `https://wa.me/${BUSINESS_DETAILS.whatsapp}?text=Hello%20K%20K%20Moulding%2C%20I%20am%20interested%20in%20your%20wooden%20moulding%20products.`;
  const phoneUrl = `tel:${BUSINESS_DETAILS.phone}`;

  return (
    <div className="fixed bottom-[6rem] right-6 sm:bottom-[5rem] sm:right-6 z-40 flex flex-col gap-3">
      {/* Call Button */}
      <a
        href={phoneUrl}
        className="flex items-center justify-center rounded-full bg-[#34d399] p-4 text-white shadow-xl hover:bg-[#10b981] hover:scale-110 transition-all duration-300 group hover:shadow-[#10b981]/30"
        aria-label="Call Us"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-sm font-semibold pr-0 group-hover:pr-2">
          Call Now
        </span>
        <PhoneCall size={24} className="animate-pulse" />
      </a>
      
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 group hover:shadow-[#25D366]/30"
        aria-label="Contact on WhatsApp"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-sm font-semibold pr-0 group-hover:pr-2">
          Chat with us
        </span>
        <MessageCircle size={24} className="animate-pulse" />
      </a>
    </div>
  );
}

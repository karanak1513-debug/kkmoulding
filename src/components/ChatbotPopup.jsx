import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full p-4 text-white shadow-xl transition-all duration-300 group hover:scale-110 ${isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#5c3d2e] hover:bg-[#4a3125]'}`}
        aria-label="Toggle Chatbot"
      >
        {!isOpen && (
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-sm font-semibold pr-0 group-hover:pr-2">
            Ask AI
          </span>
        )}
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-[5.5rem] right-2 sm:bottom-[5.5rem] sm:right-6 z-40 w-[calc(100vw-16px)] sm:w-[380px] h-[70vh] sm:h-[550px] max-h-[600px] bg-transparent sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex-1 w-full bg-white relative overflow-hidden rounded-2xl border border-gray-200">
          {isOpen && (
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/o9AKty6fSXLJbjftVfMjp"
              width="100%"
              style={{ height: '100%', minHeight: '700px' }}
              frameBorder="0"
              allow="microphone"
              className="absolute inset-0"
              title="Chatbase AI Assistant"
            ></iframe>
          )}
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp = () => {
  return (
    <a 
      href="https://wa.me/919876543210?text=Hello%20Sri%20Krishna%20Stationery%20and%20Gift,%20I%20have%20an%20inquiry%20about%20your%20products!" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="sk-floating-whatsapp"
      title="Chat with Sri Krishna Stationery on WhatsApp"
    >
      <MessageCircle size={22} />
      <span>Order on WhatsApp</span>
    </a>
  );
};

'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaWhatsapp, FaPaperPlane } from 'react-icons/fa';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const phoneNumber = '8801796777157'; // Replace with your WhatsApp number
  const welcomeMessages = useMemo(() => [
    'Hello 👋, welcome to BabyAGES',
    'How can we help you?'
  ], []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setDisplayedMessages([]);
      let i = 0;
      const showMessages = () => {
        if (i < welcomeMessages.length) {
          setDisplayedMessages(prev => [...prev, welcomeMessages[i]]);
          i++;
          setTimeout(showMessages, 10);
        }
      };
      showMessages();
    }
  }, [isOpen, welcomeMessages]);

  const openWhatsApp = () => {
    const message = welcomeMessages.join('\n');
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110"
      >
        <FaWhatsapp size={32} />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-2xl transition-all duration-300 transform origin-bottom-right scale-95 animate-in slide-in-from-bottom-5 fade-in-0 zoom-in-95">
          <div className="bg-green-500 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-lg">Chat with us</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              &times;
            </button>
          </div>
          <div className="p-4">
            {displayedMessages.map((msg, index) => (
              <div key={index} className="mb-2 animate-in fade-in duration-500">
                <p className="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 inline-block">{msg}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-100 rounded-b-xl">
            <button
              onClick={openWhatsApp}
              className="bg-green-500 text-white rounded-lg w-full py-3 font-semibold flex items-center justify-center transition-colors duration-300 hover:bg-green-600"
            >
              <FaPaperPlane className="mr-2" />
              Open Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppWidget;

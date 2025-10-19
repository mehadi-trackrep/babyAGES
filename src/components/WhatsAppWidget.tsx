'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaWhatsapp, FaPaperPlane } from 'react-icons/fa';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
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
      setIsTyping(true);
      setTimeout(() => {
        setDisplayedMessages(prev => [...prev, welcomeMessages[0]]);
        setIsTyping(false);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setDisplayedMessages(prev => [...prev, welcomeMessages[1]]);
            setIsTyping(false);
          }, 1000);
        }, 500);
      }, 1000);
    }
  }, [isOpen, welcomeMessages]);

  const openWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <div className="relative">
      <button
        onClick={toggleChat}
        className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110"
      >
        <FaWhatsapp size={24} />
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
            {isTyping && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            )}
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

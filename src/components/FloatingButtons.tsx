
'use client';

import ScrollToTopButton from './ScrollToTopButton';
import WhatsAppWidget from './WhatsAppWidget';

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end -space-x-7">
      <ScrollToTopButton />
      <WhatsAppWidget />
    </div>
  );
};

export default FloatingButtons;

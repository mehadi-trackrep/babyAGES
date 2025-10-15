import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BabyAGES</h3>
            <p className="text-gray-300">
              Your one-stop destination for all your shopping needs. Quality products at affordable prices.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/shop" className="text-gray-300 hover:text-white">Shop</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Return Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-300 not-italic">
              <p>123 Shop Street</p>
              <p>City, Country 12345</p>
              <p className="mt-2">Email: info@babyages.com</p>
              <p>Phone: +1 234 567 8900</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BabyAGES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
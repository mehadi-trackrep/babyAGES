import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BabyAGES</h3>
            <p className="text-gray-300">
              Your ultimate destination for baby, mom, and family essentials — where top-rated picks and premium quality meet everyday cuteness at prices you&apos;ll love. 💕
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
              <p>Abdul Aziz Lane, Lalbagh, Azimpur</p>
              <p>Dhaka 1204, Bangladesh</p>
              <p className="mt-2">Email: mstechy49@gmail.com</p>
              <p>Phone: (+880)1330-528534</p>
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
import { Link } from 'react-router-dom';
import { Scissors, Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

// TikTok icon component
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-barber-dark text-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Scissors className="w-8 h-8 text-barber-gold" />
              <span className="font-serif text-xl font-bold">Faith & Fades</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional barbering with military precision and artistic style. 
              Serving Oklahoma City with faith and fades.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.tiktok.com/@flying_oppusit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-barber-gold transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-barber-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-barber-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-serif text-lg font-semibold mb-4 text-barber-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-serif text-lg font-semibold mb-4 text-barber-gold">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Haircuts</li>
              <li>Fades & Tapers</li>
              <li>Beard Trims</li>
              <li>Hot Towel Shaves</li>
              <li>Line-ups</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-serif text-lg font-semibold mb-4 text-barber-gold">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-barber-gold" />
                <span>(904) 480-9422</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-barber-gold" />
                <span>Oklahoma City, OK</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-barber-gold" />
                <span>Sun: 6:00 AM - 1:00 PM</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Faith and Fades Barbershop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Star, Clock, Phone, ChevronRight } from 'lucide-react';

function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-4">
              <Scissors className="w-16 h-16 mx-auto text-barber-gold" />
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              Faith & Fades
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-xl md:text-2xl mb-4 text-gray-200"
            >
              Barbershop
            </motion.p>
            
            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-300"
            >
              Military precision meets artistic style. Professional barbering 
              serving Oklahoma City with faith and fades.
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/contact" className="btn-primary text-lg">
                Book Appointment
              </Link>
              <Link to="/portfolio" className="btn-secondary text-lg">
                View Portfolio
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <a 
                href="https://www.tiktok.com/@flying_oppusit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-white hover:text-barber-gold transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>Watch me on TikTok</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-3 bg-barber-gold rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-barber-dark py-12">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '17+', label: 'Years Military Service' },
              { number: '700+', label: 'Hours Training' },
              { number: '100%', label: 'Satisfaction' },
              { number: 'Sundays', label: '6AM - 1PM' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-barber-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From classic cuts to modern styles, we deliver precision grooming 
              tailored to your look.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Haircuts',
                description: 'Classic and modern cuts tailored to your style and face shape.',
                icon: Scissors,
              },
              {
                title: 'Fades & Tapers',
                description: 'Precision fades and tapers with seamless blending.',
                icon: Star,
              },
              {
                title: 'Beard Grooming',
                description: 'Expert beard trims, shaping, and hot towel shaves.',
                icon: Star,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <service.icon className="w-12 h-12 text-barber-gold mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary inline-flex items-center">
              View All Services <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80"
                alt="Barber at work"
                className="rounded-xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="text-barber-gold">Faith & Fades?</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Military Precision',
                    description: '17 years of military service taught me attention to detail and discipline that shows in every cut.',
                  },
                  {
                    title: 'Professional Training',
                    description: '700+ hours of professional barber training and continuing education.',
                  },
                  {
                    title: 'Personal Touch',
                    description: 'Private residence setting for a relaxed, one-on-one experience.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-barber-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-barber-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-barber-dark text-white">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready for a Fresh Cut?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Book your appointment today and experience the Faith & Fades difference. 
              Sunday appointments available 6AM - 1PM.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="btn-primary text-lg">
                <Phone className="w-5 h-5 inline mr-2" />
                Book Now
              </Link>
              <a href="tel:9044809422" className="btn-secondary text-lg">
                <Phone className="w-5 h-5 inline mr-2" />
                (904) 480-9422
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;

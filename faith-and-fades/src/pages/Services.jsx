import { motion } from 'framer-motion';
import { Scissors, Star, Clock, DollarSign } from 'lucide-react';

function Services() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const services = [
    {
      title: 'Classic Haircut',
      description: 'Traditional haircut with precision edging and styling. Includes consultation to find the perfect look for your face shape and lifestyle.',
      price: '$25',
      duration: '30 min',
      icon: Scissors,
    },
    {
      title: 'Fade / Taper',
      description: 'Expert fade or taper cut with seamless blending. Choose from low, mid, high, or skin fades.',
      price: '$30',
      duration: '35 min',
      icon: Scissors,
    },
    {
      title: 'Beard Trim',
      description: 'Professional beard shaping and trimming to complement your haircut and facial structure.',
      price: '$15',
      duration: '15 min',
      icon: Scissors,
    },
    {
      title: 'Haircut & Beard Combo',
      description: 'Complete grooming package. Fresh cut plus beard trim and shaping for a polished look.',
      price: '$35',
      duration: '45 min',
      icon: Scissors,
    },
    {
      title: 'Hot Towel Shave',
      description: 'Classic straight razor shave with hot towel treatment, pre-shave oil, and aftershave balm.',
      price: '$25',
      duration: '30 min',
      icon: Scissors,
    },
    {
      title: 'Line-up / Edge-up',
      description: 'Clean up your existing haircut with sharp lines and precise edging around the hairline and beard.',
      price: '$15',
      duration: '15 min',
      icon: Scissors,
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Book Online',
      description: 'Schedule your appointment through our booking form or call/text.',
    },
    {
      step: '02',
      title: 'Consultation',
      description: 'We discuss your desired style and I recommend what works best for you.',
    },
    {
      step: '03',
      title: 'The Cut',
      description: 'Relax and enjoy a professional cut with attention to every detail.',
    },
    {
      step: '04',
      title: 'Style & Finish',
      description: 'Leave looking fresh with styling tips to maintain your look.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Professional barbering services with military precision and artistic style
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl font-bold mb-4">Service Menu</h2>
            <p className="text-gray-600">Quality cuts at fair prices</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <service.icon className="w-10 h-10 text-barber-gold" />
                    <span className="text-2xl font-bold text-barber-dark">{service.price}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {service.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">Simple steps to your fresh cut</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-barber-gold/20 mb-4">
                  {step.step}
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="section-padding bg-barber-dark text-white">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="w-12 h-12 text-barber-gold mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold mb-4">Satisfaction Guaranteed</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Not happy with your cut? Let me know and I'll make it right. 
              Your satisfaction is my priority.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Services;

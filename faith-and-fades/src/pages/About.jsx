import { motion } from 'framer-motion';
import { Award, Clock, Shield, Star, Heart } from 'lucide-react';

function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'Built on 17 years of military service, integrity is at the core of everything I do.',
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Every cut is an opportunity to deliver excellence. No shortcuts, no compromises.',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Serving Oklahoma City with a commitment to building relationships, one cut at a time.',
    },
  ];

  const timeline = [
    {
      year: '2008',
      title: 'Military Service Begins',
      description: 'Started 17-year journey in the military, learning discipline and attention to detail.',
    },
    {
      year: '2017',
      title: 'Jiu Jitsu Brown Belt',
      description: 'Earned brown belt after 9 years of dedicated training and practice.',
    },
    {
      year: '2023',
      title: 'Barber School',
      description: 'Began professional barber training, completing 700+ hours of education.',
    },
    {
      year: '2026',
      title: 'Faith & Fades',
      description: 'Launched Faith and Fades Barbershop to serve Oklahoma City.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1920&q=80')`,
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
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            From military service to master barber
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
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
              <h2 className="font-serif text-4xl font-bold mb-6">
                Meet <span className="text-barber-gold">Gabe</span>
              </h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  I'm Gabe, a Filipino-American barber based in Oklahoma City. My journey to 
                  becoming a barber started with 17 years of military service, where I learned 
                  the value of discipline, precision, and attention to detail.
                </p>
                
                <p>
                  After nearly two decades of service, I decided to pursue my passion for 
                  barbering. I've completed over 700 hours of professional training and 
                  continue to hone my craft every day.
                </p>
                
                <p>
                  When I'm not cutting hair, you'll find me on the mats practicing jiu jitsu 
                  (I'm a brown belt with 17 years of experience) or spending time with my 
                  three daughters.
                </p>
                
                <p>
                  Faith and Fades isn't just a barbershop—it's a commitment to excellence, 
                  community, and the belief that a great haircut can make a difference in 
                  how you feel and present yourself to the world.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <Award className="w-5 h-5 text-barber-gold" />
                  <span className="font-medium">700+ Hours Training</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <Shield className="w-5 h-5 text-barber-gold" />
                  <span className="font-medium">17 Years Military</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-barber-gold" />
                  <span className="font-medium">Brown Belt Jiu Jitsu</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide every cut</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-barber-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-barber-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl font-bold mb-4">My Journey</h2>
            <p className="text-gray-600">The path to Faith & Fades</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row items-start md:items-center mb-8 last:mb-0"
              >
                <div className="w-24 flex-shrink-0">
                  <span className="text-2xl font-bold text-barber-gold">{item.year}</span>
                </div>
                <div className="hidden md:block w-px h-16 bg-gray-300 mx-6" />
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-serif text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
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
            <h2 className="font-serif text-4xl font-bold mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Book your appointment today and see why Faith & Fades is becoming 
              Oklahoma City's trusted barbershop.
            </p>
            <a href="/contact" className="btn-primary text-lg">
              Book Your Cut
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;

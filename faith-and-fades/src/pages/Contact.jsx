import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      // In a real implementation, you'd send this data to a backend
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '(904) 480-9422',
      link: 'tel:9044809422',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Oklahoma City, OK',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Hours',
      content: 'Sunday: 6:00 AM - 1:00 PM',
      link: null,
    },
  ];

  const services = [
    'Classic Haircut',
    'Fade / Taper',
    'Beard Trim',
    'Haircut & Beard Combo',
    'Hot Towel Shave',
    'Line-up / Edge-up',
  ];

  const timeSlots = [
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM',
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
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
            Book Your Cut
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Schedule your appointment today
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl font-bold mb-6">
                Get in <span className="text-barber-gold">Touch</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Ready for a fresh cut? Book your appointment online or give me a call. 
                I look forward to seeing you!
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-barber-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-barber-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 hover:text-barber-gold transition-colors">
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-8 p-6 bg-barber-dark text-white rounded-xl">
                <h3 className="font-serif text-xl font-semibold mb-2">Note</h3>
                <p className="text-gray-300">
                  I operate from a private residence in Oklahoma City. The exact address 
                  will be provided after you book your appointment.
                </p>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-2">Booking Request Received!</h3>
                  <p className="text-gray-600 mb-4">
                    Thanks {formData.name}! I'll contact you at {formData.phone} to confirm your appointment.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        service: '',
                        date: '',
                        time: '',
                        message: '',
                      });
                    }}
                    className="btn-primary"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="font-serif text-2xl font-semibold mb-6">Book Appointment</h3>
                  
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent ${
                          errors.service ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                      {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent ${
                            errors.date ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time *
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent ${
                            errors.time ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barber-gold focus:border-transparent"
                        placeholder="Any special requests or notes..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Request Appointment</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Diagonal accent */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-24 h-1 bg-gray-900"></div>
          <div className="absolute top-0 left-24 w-16 h-1 bg-gray-900 transform rotate-45 origin-left"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-16 mt-16">
          {/* Contact form */}
          <div className="md:w-2/3">
            <div className="mb-12">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Get In Touch</h2>
              <div className="h-1 w-16 bg-gray-900 mb-6"></div>
              <p className="text-gray-600 max-w-lg">
                Have a project in mind or want to discuss possibilities? Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 focus:outline-none peer"
                    placeholder=" "
                  />
                  <label className="absolute left-2 -top-6 text-sm font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gray-500">
                    Full Name
                  </label>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 peer-focus:w-full"></div>
                </div>
                
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 focus:outline-none peer"
                    placeholder=" "
                  />
                  <label className="absolute left-2 -top-6 text-sm font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gray-500">
                    Email Address
                  </label>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 peer-focus:w-full"></div>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 focus:outline-none peer"
                  placeholder=" "
                />
                <label className="absolute left-2 -top-6 text-sm font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gray-500">
                  Subject
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 peer-focus:w-full"></div>
              </div>
              
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 focus:outline-none peer resize-none"
                  placeholder=" "
                ></textarea>
                <label className="absolute left-0 -top-6 text-sm font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gray-500">
                  Your Message
                </label>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 peer-focus:w-full"></div>
              </div>
              
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gray-900 text-white font-bold tracking-wider uppercase border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </motion.button>
                
                {submitSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-6 text-green-600 font-medium"
                  >
                    Message sent successfully!
                  </motion.div>
                )}
              </div>
            </form>
          </div>
          
          {/* Contact info */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 border border-gray-200 p-10 h-full">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="h-0.5 w-12 bg-gray-900 mb-8"></div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Our Location</h4>
                      <p className="text-gray-600">123 Design Avenue, Creative District, CA 90210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Phone Number</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email Address</h4>
                      <p className="text-gray-600">contact@ecommerce.store</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                <div className="h-0.5 w-12 bg-gray-900 mb-8"></div>
                
                <div className="flex space-x-4">
                  {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                    <motion.a
                      key={social}
                      href="#"
                      whileHover={{ y: -5 }}
                      className="w-12 h-12 flex items-center justify-center border border-gray-300 hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 group"
                    >
                      <div className="w-6 h-6 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                        {/* Social icon placeholder */}
                        <div className="w-4 h-4 bg-gray-300 group-hover:bg-white"></div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Diagonal accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gray-900 transform -skew-y-3 origin-left -translate-y-16"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold tracking-tight text-gray-900 mb-6"
            >
              OUR STORY
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-1 w-24 bg-gray-900 mx-auto mb-10"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Redefining e-commerce with curated excellence and unparalleled service since 2023.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12 lg:mb-0"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">OUR MISSION</h2>
              <div className="h-1 w-16 bg-gray-900 mb-8"></div>
              <p className="text-gray-600 mb-6">
                To deliver exceptional products with a seamless shopping experience that combines 
                cutting-edge technology with human-centric design.
              </p>
              <p className="text-gray-600">
                We believe in quality over quantity, carefully curating each item in our collection 
                to ensure it meets our high standards of craftsmanship and design.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-96 bg-gray-200"
            >
              {/* Placeholder for mission image */}
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Mission Visual</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gray-900 z-0"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">OUR VALUES</h2>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every interaction we have.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Quality",
                description: "We source only the finest materials and work with artisans who share our commitment to excellence.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Innovation",
                description: "We constantly push boundaries to deliver fresh, forward-thinking solutions to our customers.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Integrity",
                description: "We conduct business with honesty and transparency, building trust with every interaction.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">MEET THE TEAM</h2>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind our brand's success.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Sarah Chen",
                role: "Creative Director",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Technology",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Emily Wilson",
                role: "Customer Experience",
                image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden mb-4 h-80">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <h3 className="text-white font-bold text-xl">{member.name}</h3>
                      <p className="text-gray-300">{member.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            JOIN OUR JOURNEY
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="h-1 w-16 bg-white mx-auto mb-10"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl mb-8 max-w-3xl mx-auto"
          >
            Discover the difference that passion and craftsmanship can make.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button className="px-8 py-3 bg-white text-gray-900 font-bold tracking-wider uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300">
              SHOP NOW
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
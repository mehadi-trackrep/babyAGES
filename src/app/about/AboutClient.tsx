'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBaby, FaHeart, FaShieldAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function AboutClient() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Hero Section */}
      <motion.div
        className="relative bg-cover bg-center text-white py-32 px-4 md:px-8"
        style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} // Add a suitable hero image
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About BabyAGES
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Nurturing the moments that matter most, from one generation to the next.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-4xl font-bold text-indigo-600">Our Story</h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Welcome to BabyAGES, where our passion for parenthood drives everything we do. We believe that every child deserves the best, and we are here to provide families with products that are safe, innovative, and full of love.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Image 
                src="/images/our-story.jpg" // Add a relevant image
                alt="Our Story" 
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">From Our Family to Yours</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our journey started with a simple mission: to create a trusted space for parents to find everything they need for their little ones. As parents ourselves, we know the joy and challenges that come with raising a child. That&apos;s why we&apos;ve dedicated ourselves to curating a collection that combines quality, style, and practicality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From the softest blankets to the most engaging toys, each product is chosen with care, ensuring it meets our high standards of safety and craftsmanship.
              </p>
            </motion.div>
          </div>

          {/* Our Mission & Promise */}
          <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
            <motion.h2 
              className="text-4xl font-bold text-indigo-600 mb-12"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              Our Core Values
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <div className="p-6 flex flex-col items-center">
                  <FaHeart className="text-5xl text-pink-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Unconditional Love</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe every child thrives on love. Our products are designed to enhance the beautiful bond between parent and child.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <div className="p-6 flex flex-col items-center">
                  <FaShieldAlt className="text-5xl text-blue-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Safety First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your child&apos;s safety is our top priority. We rigorously test our products to ensure they meet the highest safety standards.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <div className="p-6 flex flex-col items-center">
                  <FaBaby className="text-5xl text-green-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Joyful Growth</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to fostering development through play. Our toys are designed to be both fun and educational.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="text-center mt-20"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-bold text-indigo-600">Join Our Family</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for choosing BabyAGES. We are honored to be a part of your family&apos;s story and look forward to growing with you.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
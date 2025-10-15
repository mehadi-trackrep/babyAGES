
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white py-12 px-4 md:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About BabyAGES</h1>
        
        <div className="space-y-6 text-gray-600">
          <p className="leading-relaxed">
            Welcome to BabyAGES, your trusted partner in the wonderful journey of parenthood. We understand that every moment with your little one is precious, and we are dedicated to providing you with the highest quality products to make those moments even more special.
          </p>
          
          <p className="leading-relaxed">
            Our story began with a simple idea: to create a one-stop shop for parents to find safe, reliable, and innovative products for their babies and young children. From essential gear like strollers and car seats to adorable clothing and educational toys, every item in our collection is carefully selected to meet the needs of modern families.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-700 pt-4">Our Mission</h2>
          <p className="leading-relaxed">
            Our mission is to support parents by offering a curated selection of products that are not only stylish and functional but also adhere to the highest standards of safety and quality. We believe in making parenting easier and more enjoyable, so you can focus on what truly matters: creating lasting memories with your child.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-700 pt-4">Our Promise</h2>
          <p className="leading-relaxed">
            At BabyAGES, we are committed to excellence in everything we do. We promise to provide:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Quality You Can Trust:</strong> We partner with reputable brands and manufacturers to bring you products that are built to last.</li>
            <li><strong>Unparalleled Customer Service:</strong> Our friendly and knowledgeable team is here to help you with any questions or concerns.</li>
            <li><strong>A Community of Support:</strong> We are more than just a retailer; we are a community of parents who share a common bond.</li>
          </ul>
          
          <p className="leading-relaxed pt-4">
            Thank you for choosing BabyAGES. We are honored to be a part of your family&apos;s story.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

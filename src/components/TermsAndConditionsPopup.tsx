import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsAndConditionsPopupProps {
  onClose: () => void;
}

const TermsAndConditionsPopup: React.FC<TermsAndConditionsPopupProps> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -50 }}
          className={'bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full flex flex-col'}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 border-b pb-3">
            babyages.com.bd ব্যবহারের নিয়ম ও শর্তাবলী
          </h2>
          
          {/* Scrollable Content Area */}
          <div className="space-y-4 text-gray-700 overflow-y-auto max-h-[70vh] pr-4">
            <p className="text-sm">
              babyages.com.bd-তে আপনাকে স্বাগতম। আমাদের ওয়েবসাইট, মোবাইল অ্যাপ, এবং অন্যান্য পরিষেবা ব্যবহার করার আগে অনুগ্রহ করে এই নিয়ম ও শর্তাবলী মনোযোগ দিয়ে পড়ুন। এই সাইট ব্যবহার করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মত বলে গণ্য হবেন। এই ওয়েবসাইটটি &quot;HalalAid: BabyAGES&quot;-এর মালিকানাধীন এবং পরিচালিত।
            </p>
            <p className="text-sm italic">
              আমরা কোনো পূর্ব বিজ্ঞপ্তি ছাড়াই এই শর্তাবলী পরিবর্তন, সংশোধন বা বাতিল করার অধিকার রাখি। যেকোনো পরিবর্তন ওয়েবসাইটে পোস্ট করার সাথে সাথেই কার্যকর হবে।
            </p>
            
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">১. ভূমিকা</h3>
              <p>
                babyages.com.bd একটি অনলাইন মার্কেটপ্লেস। এই শর্তাবলী আমাদের ওয়েবসাইট এবং পরিষেবার (&quot;সাইট&quot;) ব্যবহার নিয়ন্ত্রণ করে। সাইটটি ব্যবহার করে আপনি এই &quot;ব্যবহারকারী চুক্তি&quot; মেনে চলতে সম্মত হচ্ছেন। আমাদের নিবন্ধিত অফিসের ঠিকানা: Abdul Aziz Lane, Azimpur, Lalbagh, Dhaka-1202।
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">২. ব্যবহারকারীর অ্যাকাউন্ট, পাসওয়ার্ড ও নিরাপত্তা</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-semibold">গোপনীয়তা:</span> আপনার অ্যাকাউন্টের ইউজার আইডি ও পাসওয়ার্ডের গোপনীয়তা রক্ষা করার দায়িত্ব আপনার।</li>
                <li><span className="font-semibold">দায়বদ্ধতা:</span> আপনার অ্যাকাউন্ট ব্যবহার করে কোনো কার্যকলাপ ঘটলে, তার জন্য আপনি দায়ী থাকবেন।</li>
                <li><span className="font-semibold">নিরাপত্তা:</span> যদি মনে করেন আপনার পাসওয়ার্ড অননুমোদিতভাবে ব্যবহৃত হচ্ছে, তবে অবিলম্বে আমাদের জানান।</li>
                <li><span className="font-semibold">তথ্যের সঠিকতা:</span> আপনাকে অবশ্যই নিশ্চিত করতে হবে যে আপনার দেওয়া সমস্ত তথ্য সঠিক এবং সম্পূর্ণ।</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৩. গোপনীয়তা</h3>
              <p>
                আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার ও সংরক্ষণ করি, তা জানতে অনুগ্রহ করে আমাদের <strong>গোপনীয়তা নীতি</strong> পড়ুন।
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৪. সাইট ব্যবহারের লাইসেন্স</h3>
              <ul className="list-disc list-inside space-y-1">
                  <li><span className="font-semibold">বয়সসীমা:</span> সাইটটি ব্যবহারের জন্য আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে অথবা অভিভাবকের তত্ত্বাবধানে ব্যবহার করতে হবে।</li>
                  <li><span className="font-semibold">উদ্দেশ্য:</span> আমরা আপনাকে শুধুমাত্র ব্যক্তিগত কেনাকাটার উদ্দেশ্যে এই সাইটটি ব্যবহার করার জন্য একটি সীমিত লাইসেন্স প্রদান করছি।</li>
                  <li><span className="font-semibold">বিধিনিষেধ:</span> আমাদের অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে এই সাইট বা এর কোনো কনটেন্ট ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৫. বিক্রয়ের শর্তাবলী</h3>
              <p className='mb-2'><strong className='font-semibold'>ক) চুক্তি:</strong> আপনার অর্ডার আমাদের কাছে একটি পণ্য কেনার প্রস্তাব। পণ্যটি আপনার ঠিকানায় পাঠানোর পরেই অর্ডারটি নিশ্চিত বলে গণ্য হবে।</p>
              <p className='mb-2'><strong className='font-semibold'>খ) মূল্য এবং প্রাপ্যতা:</strong> সকল পণ্যের মূল্য বাংলাদেশী টাকায় (BDT) উল্লেখ করা এবং এতে ভ্যাট অন্তর্ভুক্ত। পণ্যের প্রাপ্যতা বা ডেলিভারির সময়সীমা শুধুমাত্র আনুমানিক।</p>
              <p className='mb-2'><strong className='font-semibold'>গ) ওয়ারেন্টি:</strong> পণ্যের ধরনের ওপর নির্ভর করে ব্র্যান্ডের দেওয়া ওয়ারেন্টির সুবিধা প্রযোজ্য হতে পারে। babyages.com.bd নিজে কোনো ওয়ারেন্টি প্রদান করে না।</p>
              <p><strong className='font-semibold'>ঘ) পণ্যের বিবরণ:</strong> আমরা পণ্যের সঠিক বিবরণ দেওয়ার সর্বোচ্চ চেষ্টা করি। কোনো পণ্যের বিবরণ না মিললে, আপনার একমাত্র প্রতিকার হলো পণ্যটি অব্যবহৃত অবস্থায় ফেরত দেওয়া।</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৬. রিটার্ন ও এক্সচেঞ্জ নীতি</h3>
              <p className="font-semibold">শর্তাবলী:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>ডেলিভারি পাওয়ার <strong>২ দিনের</strong> মধ্যে রিটার্নের জন্য আবেদন করতে হবে।</li>
                <li>পণ্যটি অবশ্যই অব্যবহৃত এবং এর আসল প্যাকেজিং ও ট্যাগ অক্ষত থাকতে হবে।</li>
                <li>প্রতিস্থাপন (Exchange) স্টকের ওপর নির্ভরশীল। স্টক না থাকলে সম্পূর্ণ অর্থ রিফান্ড করা হবে।</li>
                <li>ক্যাশ অন ডেলিভারি চার্জ এবং শিপিং চার্জ অফেরতযোগ্য।</li>
                <li>রিটার্ন করা পণ্য যাচাই করে <strong>৫-১২ কার্যদিবসের</strong> মধ্যে অর্থ ফেরত দেওয়া হবে।</li>
              </ul>
              <p className='mt-2'><strong className='font-semibold'>কীভাবে রিটার্ন করবেন:</strong> আপনার অর্ডার ডেলিভারি পাওয়ার ৩ দিনের মধ্যে আমাদের কাস্টমার কেয়ারে ইমেল করুন (mstechy49@gmail.com)।</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৭. অর্ডার বাতিলকরণ</h3>
              <p>
                অর্ডার কনফার্মেশন কলের সময় আপনি অর্ডারটি বাতিল করতে পারেন। কলের মাধ্যমে অর্ডার নিশ্চিত করার পর তা আর বাতিল করা যাবে না। প্রিপেইড অর্ডারের ক্ষেত্রে, অর্ডার বাতিল হলে সম্পূর্ণ অর্থ ফেরত দেওয়া হবে।
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৮. পেমেন্ট এবং শিপিং</h3>
              <p>
                <strong className='font-semibold'>পেমেন্ট পদ্ধতি:</strong> আমরা ক্যাশ অন ডেলিভারি (COD), ডেবিট/ক্রেডিট কার্ড এবং মোবাইল ব্যাংকিং সমর্থন করি। <br/>
                <strong className='font-semibold'>শিপিং:</strong> শিপিংয়ের সময়সীমা শুধুমাত্র আনুমানিক। পণ্য আপনার কাছে হস্তান্তরের সাথে সাথেই এর সম্পূর্ণ ঝুঁকি আপনার ওপর বর্তাবে।
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">৯. তৃতীয় পক্ষের লিঙ্ক</h3>
              <p>
                আমাদের ওয়েবসাইটে অন্য কোনো ওয়েবসাইটের লিঙ্ক থাকতে পারে, যা আমাদের নিয়ন্ত্রণে নেই। সেই সব লিঙ্কের কোনো বিষয়বস্তু বা কার্যকলাপের জন্য babyages.com.bd দায়ী থাকবে না।
              </p>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="mt-6 text-right border-t pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              বন্ধ করুন
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsAndConditionsPopup;
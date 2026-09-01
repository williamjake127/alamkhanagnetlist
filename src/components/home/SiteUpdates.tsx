"use client";

import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";

interface UpdateSlide {
  title: string;
  description: string;
  date?: string;
}

export function SiteUpdates() {
  const slides: UpdateSlide[] = [
    {
      title: "নিরাপদ লেনদেন নিশ্চিত করুন",
      description: "সবসময় সাইটে উল্লেখিত ভেরিফাইড হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করুন এবং লেনদেনের আগে এজেন্ট আইডি যাচাই করুন।",
      date: "Latest",
    },
    {
      title: "নতুন এজেন্ট তালিকা আপডেট",
      description: "আমাদের মাস্টার এজেন্ট এবং সুপার এজেন্ট তালিকা নিয়মিত আপডেট করা হয়। সর্বশেষ তালিকার জন্য পেজটি রিফ্রেশ করুন।",
      date: "Update",
    },
    {
      title: "২৪/৭ কাস্টমার সাপোর্ট",
      description: "যেকোনো ধরণের অভিযোগ বা তথ্যের জন্য আমাদের সাপোর্ট অপশনে ক্লিক করে সরাসরি যোগাযোগ করতে পারেন।",
      date: "Notice",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-light_black py-4 px-4 md:px-10 pb-4 rounded-[8px] h-full flex flex-col justify-between">
      <h1 className="text-primary font-hind text-center font-medium text-[18px] pb-4">
        সাইটের নতুন সব আপডেটঃ
      </h1>
      <div className="flex items-center justify-center rounded-[8px] flex-grow">
        <div className="bg-deep_black w-full rounded-[8px] p-6 h-full flex flex-col justify-center relative min-h-[140px]">
          <div className="relative w-full h-full overflow-hidden flex flex-col justify-center items-center text-center px-8">
            <h2 className="text-primary font-hind text-base md:text-lg font-medium mb-1">
              {slides[currentSlide].title}
            </h2>
            <p className="text-white text-xs md:text-sm font-hind leading-relaxed">
              {slides[currentSlide].description}
            </p>

            {/* Left arrow */}
            <button
              type="button"
              onClick={prevSlide}
              className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full p-1 text-white hover:bg-white/10 active:bg-white/30 transition-colors"
              aria-label="Previous update"
            >
              <ChevronLeftIcon className="h-6 w-6 text-primary" />
            </button>

            {/* Right arrow */}
            <button
              type="button"
              onClick={nextSlide}
              className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full p-1 text-white hover:bg-white/10 active:bg-white/30 transition-colors"
              aria-label="Next update"
            >
              <ChevronRightIcon className="h-6 w-6 text-primary" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 pt-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide ? "w-4 bg-primary" : "w-1.5 bg-white/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

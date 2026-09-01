"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";
import { Sparkles } from "lucide-react";
import { useSiteData } from "@/lib/site-context";

interface SiteUpdatesProps {
  initialImages?: string[];
}

export function SiteUpdates({ initialImages }: SiteUpdatesProps) {
  const { settings } = useSiteData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images =
    initialImages && initialImages.length > 0
      ? initialImages
      : (settings.sliderImages || []).filter((img) => !!img);

  // Fallback banners if no custom images uploaded
  const fallbackSlides = [
    {
      title: "নিরাপদ লেনদেন নিশ্চিত করুন",
      subtitle: "আমাদের ভেরিফাইড ও ট্রাস্টেড এজেন্টদের তালিকা থেকে আপনার পছন্দের এজেন্টের সাথে নিরাপদে যোগাযোগ করুন।",
      badge: "জরুরী নোটিশ",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    {
      title: "২৪/৭ কাস্টমার হেল্পলাইন",
      subtitle: "যেকোনো সাহায্য বা অভিযোগের জন্য আমাদের অফিসিয়াল সাপোর্ট এজেন্টের সাথে যোগাযোগ করুন।",
      badge: "Live Support",
      gradient: "from-blue-600/20 via-indigo-500/10 to-transparent",
    },
    {
      title: "সুপার ও মাস্টার এজেন্ট ডিরেক্টরি",
      subtitle: "সরাসরি অনুমোদিত অ্যাডমিন ও এজেন্টদের সাথে ডিপোজিট ও উইথড্র করুন।",
      badge: "Verified List",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    },
  ];

  const totalSlides = images.length > 0 ? images.length : fallbackSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  return (
    <div
      className="bg-light_black py-4 px-3 sm:px-4 md:px-6 rounded-[8px] h-full flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h1 className="text-primary font-hind text-center font-medium text-[17px] md:text-[18px] pb-3">
        সাইটের নতুন সব আপডেটঃ
      </h1>

      <div className="flex items-center justify-center rounded-[8px] flex-grow">
        <div className="bg-deep_black w-full rounded-[8px] overflow-hidden relative h-[180px] sm:h-[200px] md:h-[210px] flex items-center justify-center border border-white/5 shadow-inner">
          {images.length > 0 ? (
            /* Custom Uploaded Photos Carousel */
            <div className="relative w-full h-full">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 pointer-events-none scale-95"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Update banner ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover sm:object-contain object-center"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Fallback Stylized Slide Cards */
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {fallbackSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full p-4 sm:p-6 flex flex-col justify-center items-center text-center transition-all duration-700 ease-in-out bg-gradient-to-br ${
                    slide.gradient
                  } ${
                    idx === currentIndex
                      ? "opacity-100 translate-x-0 z-10"
                      : "opacity-0 translate-x-4 z-0 pointer-events-none"
                  }`}
                >
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-2 border border-primary/30">
                    <Sparkles className="w-3 h-3" />
                    <span>{slide.badge}</span>
                  </div>
                  <h2 className="text-primary font-hind text-base sm:text-lg font-bold mb-1.5 line-clamp-1">
                    {slide.title}
                  </h2>
                  <p className="text-gray-200 text-xs sm:text-sm font-hind leading-relaxed max-w-md line-clamp-3">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Arrow: Prev */}
          {totalSlides > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-1.5 bg-black/60 hover:bg-black/80 text-primary hover:text-white backdrop-blur-sm border border-white/10 transition-all shadow-md active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          )}

          {/* Navigation Arrow: Next */}
          {totalSlides > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-1.5 bg-black/60 hover:bg-black/80 text-primary hover:text-white backdrop-blur-sm border border-white/10 transition-all shadow-md active:scale-90"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          )}

          {/* Slide Indicator Dots */}
          {totalSlides > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-5 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

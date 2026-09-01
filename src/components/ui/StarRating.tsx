import React from "react";
import { StarIcon } from "./Icons";

interface StarRatingProps {
  rating?: number;
  maxStars?: number;
  className?: string;
}

export function StarRating({ rating = 5, maxStars = 5, className = "" }: StarRatingProps) {
  return (
    <div className={`flex text-primary items-center justify-center bg-deep_black rounded-[8px] px-2 md:px-3 md:w-full py-1 md:py-2 text-[8px] md:text-[18px] ml-1 md:ml-6 gap-[2px] ${className}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <StarIcon key={i} className={i < rating ? "text-primary" : "text-gray/40"} />
      ))}
    </div>
  );
}

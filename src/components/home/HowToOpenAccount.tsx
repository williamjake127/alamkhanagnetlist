import React from "react";

export function HowToOpenAccount() {
  return (
    <div className="bg-light_black py-4 px-4 md:px-10 pb-4 rounded-[8px] h-full flex flex-col justify-between">
      <h1 className="text-primary font-hind text-center font-medium text-[18px] pb-4">
        কিভাবে একাউন্ট খুলবেনঃ
      </h1>
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-deep_black w-full rounded-[8px] p-4 h-full flex items-center">
          <p className="text-white text-[14px] tracking-normal font-hind font-medium leading-relaxed">
            আমাদের সাইটে একাউন্ট করতে হলে আপনার এজেন্ট এর মাধ্যমে একাউন্ট খুলতে হবে। এজেন্ট এর মাধ্যমেই টাকা ডিপোজিট এবং উইথড্র করতে হবে। আপনি যে এজেন্ট এর কাছ থেকে একাউন্ট খুলবেন তার সাথেই সব সময় লেনদেন করতে হবে। ঠিক কোন এজেন্ট কে টাকা দিবেন এবং কিভাবে তার সাথে লেনদেন করবেন তার বুঝতে হলে আপনার নিম্বের তথ্য গুলো পড়া জরুরী।
          </p>
        </div>
      </div>
    </div>
  );
}

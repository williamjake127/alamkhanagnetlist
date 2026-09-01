import React from "react";

export function AgentListInfo() {
  return (
    <div className="bg-light_black py-4 px-4 md:px-10 pb-4 rounded-[8px] h-full flex flex-col justify-between">
      <h1 className="text-primary font-hind text-center font-medium text-[18px] pb-4">
        এজেন্ট লিস্টঃ
      </h1>
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-deep_black w-full rounded-[8px] p-4 h-full flex items-center">
          <p className="text-white text-[14px] tracking-normal font-hind font-medium leading-relaxed">
            একাউন্ট খুলতে নিম্বের অনলাইন এজেন্ট লিস্ট এ ক্লিক করুন। এজেন্ট লিষ্ট এর এজেন্ট দের সাথে ইউজার দের শুধু মাত্র হোয়াটসাপ এর মাধ্যমে যোগাযোগ করতে হবে। হোয়াটসাপ ছাড়া অন্য কোন মাধ্যমে যোগাযোগ করলে বা লেনদেন করলে তা গ্রহনযোগ্য হবে না। হোয়াটসাপ এ যোগাযোগ করতে হলে এজেন্ট লিস্টে হোয়াটসাপ আইকন উপরে ক্লিক করুন অথবা ফোন নাম্বার টি মোবাইলে সেভ করে তাকে হোয়াটসাপ এ মসেজ পাঠাতে পারবেন। হোয়াটসাপ এপ টি আপনার মোবাইলে আগে থেকেই থাকতে হবে। না থাকলে গুগুল প্লে থেকে ইন্সটল করে নিন।
          </p>
        </div>
      </div>
    </div>
  );
}

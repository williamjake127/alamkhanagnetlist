import React from "react";
import Link from "next/link";

export function AgentTypeGuide() {
  return (
    <div className="bg-light_black col-span-10 md:col-span-7 py-4 px-4 md:px-10 pb-4 rounded-[8px]">
      <h1 className="text-primary font-hind text-center font-medium text-[18px] pb-4">
        এজেন্ট কয় প্রকারঃ
      </h1>
      <div className="flex items-center justify-center">
        <div className="bg-deep_black w-full rounded-[8px] grid md:grid-cols-3 gap-4 p-4">
          {/* Super Agent */}
          <div className="w-full bg-light_black p-4 text-center rounded-[8px] flex flex-col">
            <h1 className="text-primary font-hind text-[18px] mb-2 leading-6 font-medium">
              অনলাইন সুপার এজেন্ট লিস্টঃ
            </h1>
            <p className="text-white font-hind text-[14px] text-center mb-4 flex-grow leading-relaxed">
              সুপার এজেন্ট রা, ইউজার একাউন্ট এবং মাষ্টার এজেন্ট একাউন্ট খুলে দিতে পারেন। কোন সুপার এজেন্ট এর নামে অভিযোগ থাকলে সরাসরি এডমিন কে জানাতে হবে।
            </p>
            <Link
              href="/super"
              className="text-[14px] px-2 py-1 text-white rounded bg-error text-[10px] font-hind hover:opacity-90 transition-opacity self-center inline-block"
            >
              Report
            </Link>
          </div>

          {/* Master Agent */}
          <div className="w-full bg-light_black p-4 text-center rounded-[8px] flex flex-col">
            <h1 className="text-primary font-hind text-[18px] mb-2 leading-6 font-medium">
              অনলাইন মাষ্টার এজেন্ট লিস্টঃ
            </h1>
            <p className="text-white font-hind text-[14px] text-center mb-4 flex-grow leading-relaxed">
              অনলাইন মাষ্টার এজেন্ট রা, শুধু ইউজার একাউন্ট একাউন্ট খুলে দিতে পারেন। কোন মাষ্টার এজেন্ট এর নামে অভিযোগ থাকলে সরাসরি সুপার এজেন্ট এর কাছে অভিযোগ করতে হবে।
            </p>
            <Link
              href="/master"
              className="text-[14px] px-2 py-1 text-white rounded bg-error text-[10px] font-hind hover:opacity-90 transition-opacity self-center inline-block"
            >
              Report
            </Link>
          </div>

          {/* Local Master Agent */}
          <div className="w-full bg-light_black p-4 text-center rounded-[8px] flex flex-col">
            <h1 className="text-primary font-hind text-[18px] mb-2 leading-6 font-medium">
              লোকাল মাষ্টার এজেন্ট লিস্টঃ
            </h1>
            <p className="text-white font-hind text-[14px] text-center mb-2 flex-grow leading-relaxed">
              লোকাল মাষ্টার এজেন্ট রা, শুধু ইউজার একাউন্ট একাউন্ট খুলে দিতে পারেন। কিন্তু তাদের সাথে লেনদেন প্রতিটি ইউজার কে নিজ দায়িত্বে লেনদেন করতে হবে। তাদের নামে কোন অভিযোগ কারো কাছে করা যাবে না।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

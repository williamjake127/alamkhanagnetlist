"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "./Navbar";

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  return (
    <header>
      <div className="flex items-center justify-between md:justify-center">
        <figure className="flex items-center justify-center my-4 gap-4">
          <Link href="/" className="inline-block relative">
            <Image
              src="/images/logo.png"
              alt="Betbuzz365 Agent List Logo"
              width={360}
              height={100}
              priority
              className="w-[280px] sm:w-[300px] md:w-[360px] h-auto object-contain"
            />
          </Link>
        </figure>
      </div>
      <Navbar onOpenSearch={onOpenSearch} />
    </header>
  );
}

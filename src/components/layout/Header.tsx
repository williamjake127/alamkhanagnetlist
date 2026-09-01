"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "./Navbar";
import { useSiteData } from "@/lib/site-context";

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const { settings } = useSiteData();

  const hasLogo = Boolean(settings.siteLogo && settings.siteLogo.trim());
  const hasSiteName = Boolean(settings.siteName && settings.siteName.trim());

  return (
    <header>
      {(hasLogo || hasSiteName) && (
        <div className="flex items-center justify-between md:justify-center">
          <figure className="flex items-center justify-center my-3 sm:my-4 gap-4">
            <Link href="/" className="inline-block relative">
              {hasLogo ? (
                <div className="relative w-[220px] sm:w-[280px] md:w-[340px] h-[50px] sm:h-[65px] md:h-[80px]">
                  <Image
                    src={settings.siteLogo}
                    alt={settings.siteName || "Site Logo"}
                    fill
                    unoptimized
                    priority
                    className="object-contain"
                  />
                </div>
              ) : (
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary font-sans tracking-wide py-2 hover:opacity-90 transition-opacity">
                  {settings.siteName}
                </h1>
              )}
            </Link>
          </figure>
        </div>
      )}
      <Navbar onOpenSearch={onOpenSearch} />
    </header>
  );
}

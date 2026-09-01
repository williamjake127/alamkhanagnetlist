"use client";

import React from "react";
import { useSiteData } from "@/lib/site-context";

export function Footer() {
  const { settings } = useSiteData();
  const brand = settings.siteName ? settings.siteName.trim() + " " : "";

  return (
    <footer className="mt-8 text-center text-gray text-xs font-hind border-t border-white/5 pt-4 pb-6">
      <p>© {new Date().getFullYear()} {brand}Official Agent Directory. All Rights Reserved.</p>
    </footer>
  );
}

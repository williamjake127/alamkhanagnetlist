import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppUrl(phone: string, text?: string): string {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (text) {
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  }
  return baseUrl;
}

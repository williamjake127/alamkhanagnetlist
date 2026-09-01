import type { Metadata } from "next";
import { Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Betbuzz365 Agent List - Official Agent Directory",
  description:
    "Official Betbuzz365 Agent Directory. Find verified Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp.",
  icons: {
    icon: "/icons/avatar.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-theme="black"
      className={`${poppins.variable} ${hindSiliguri.variable}`}
    >
      <body className="bg-black text-white antialiased font-sans">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}

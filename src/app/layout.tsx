import type { Metadata } from "next";
import { Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { SiteDataProvider } from "@/lib/site-context";

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
  title: "Official Agent Directory - ভেরিফাইড এজেন্ট তালিকা",
  description:
    "Official Verified Agent Directory. Find verified Admin, Super Admin, Sub Admin, Super Agent, and Master Agent contacts safely via WhatsApp.",
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
        <SiteDataProvider>
          <AppWrapper>{children}</AppWrapper>
        </SiteDataProvider>
      </body>
    </html>
  );
}


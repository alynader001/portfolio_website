import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const urbanist = Urbanist({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Aly N. Ahmed",
  description: "Aly N. Ahmed's personal portfolio",
  icons:{
    icon:"favicon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-700 text-slate-100">
      <body
        className={urbanist.className}
      >
        <Header/>
        {children}
        <Footer/>
        <Analytics />
      </body>
    </html>
  );
}

import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundStars from "@/components/BackgroundStars";

const saira = Saira({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Aly N. Ahmed",
  description: "Aly N. Ahmed's personal portfolio",
  icons: {
    icon: [
      { url: "/apple-icon.png", sizes: "any" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-slate-100">
      <body
        className={saira.className}
      >
        <BackgroundStars/>
        <Header/>
        {children}
        <Footer/>
        <Analytics />
      </body>
    </html>
  );
}

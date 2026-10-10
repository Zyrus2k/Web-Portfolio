import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import ChatbotWidget from "@/components/chat/chatbot-widget";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zyrus | BSIT Student & Web Developer",
  description:
    "The portfolio of Zyrus, a BSIT student building practical web applications and academic systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>{children}<ChatbotWidget /></body>
    </html>
  );
}

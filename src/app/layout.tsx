import type { Metadata } from "next";
import {
  Chivo_Mono,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Poppins,
} from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["500", "600", "700"],
});

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const chivo = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-tech",
  weight: ["400"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Siscom ISP Credit Scoring & Loan Eligibility",
  description:
    "Upload your 6-month M-Pesa statement to instantly check ISP loan qualification—up to 3x your monthly net cash flow. No account required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${display.variable} ${chivo.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}

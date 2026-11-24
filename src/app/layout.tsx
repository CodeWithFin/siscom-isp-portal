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
  title: "Siscom ISP Growth — Infrastructure, WASP Billing & Working Capital",
  description:
    "Grow your ISP network. Finance infrastructure, run billing on WASP, collect through Cashia, and unlock working capital from KES 100,000 to KES 10 million.",
  icons: {
    icon: "/brand/siscom-favicon.png",
    apple: "/brand/siscom-favicon.png",
  },
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

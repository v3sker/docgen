import "./globals.css";
import { Inter } from "next/font/google";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BitWave | DocGen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-neutral-50 ${inter.className}`}>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}

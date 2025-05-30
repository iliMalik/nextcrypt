import "./globals.css";

import { ReactNode } from "react";
import Navigation_Main from "@/components/navigation_main";
import Footer_Main from "@/components/footer_main";

export const metadata = {
  title: "Diagnostic Tool",
  description: "Developmental screening app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Navigation_Main />
        <main className="flex-grow p-6">{children}</main>
        <Footer_Main />
      </body>
    </html>
  );
}

import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any theme you choose
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import Navigation_Main from "@/components/navigation_main";
import Footer_Main from "@/components/footer_main";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="layout-wrapper">
          <Navigation_Main />
          <main>{children}</main>
          <Footer_Main />
        </div>
      </body>
    </html>
  );
}

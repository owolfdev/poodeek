import { ThemeProvider } from "next-themes";
import Header from "@/components/nav/header";
import Footer from "@/components/nav/footer";
// import Link from "next/link";
import "./globals.css";
import { Inter, Source_Code_Pro } from "next/font/google";
import CookieConsentComponent from "@/components/cookie-consent";
import { CartProvider } from "@/context/CartContext";
import { ShippingProvider } from "@/context/ShippingContext";

import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Poodeek!",
  description: "Thai phrase repetition app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={sourceCodePro.className}
      suppressHydrationWarning
    >
      <body className="bg-[#f55751]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <ShippingProvider>
              <Header />
              <main className="flex flex-col items-center justify-between px-6  sm:px-10 sm:py-8 min-h-[calc(100vh-13rem)]">
                {children}
                <CookieConsentComponent />
              </main>
              <Footer />
              <Toaster />
            </ShippingProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

function Footer() {
  return (
    <footer className="bottom-0 z-40 w-full bg-[#f55751]">
      <div className="sm:px-8 px-4 flex flex-col  items-center h-32 space-y-4 sm:space-y-4 ">
        <div className="flex gap-6 items-center pt-5">
          <div className="">&copy; {new Date().getFullYear()} website.com</div>
          {/* <ThemeSwitcher /> */}
        </div>
        <nav className="flex sm:flex-row flex-col w-full justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            {/* <Link href="/blog">Blog</Link> */}
            <Link href="/privacy">Privacy</Link>
          </div>
          {/* Donate button temporarily disabled due to PayPal React 19 compatibility issues */}
          {/* 
          <div className="sm:pb-0 pb-8">
            <Link
              href="/donate"
              className="bg-yellow-300 px-3 py-1 rounded-full font-bold sm:text-xl text-2xl"
            >
              Donate
            </Link>
          </div>
          */}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

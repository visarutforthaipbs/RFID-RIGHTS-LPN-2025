import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
      role="banner"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="รู้สิทธิ ติดกระเป๋า Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-lg font-bold text-black">
                รู้สิทธิ ติดกระเป๋า
              </h1>
              <p className="text-xs text-gray-600">Migrant Rights Guide</p>
            </div>
          </Link>

          {/* Navigation and language switcher */}
          <div className="flex items-center gap-4">
            <nav
              className="hidden md:flex items-center gap-4"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                href="/topics"
                className="text-sm text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all"
              >
                หัวข้อทั้งหมด
              </Link>
              <Link
                href="/help"
                className="text-sm text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all"
              >
                ขอความช่วยเหลือ
              </Link>
              <Link
                href="/settings"
                className="text-sm text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all"
              >
                ตั้งค่า
              </Link>
            </nav>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

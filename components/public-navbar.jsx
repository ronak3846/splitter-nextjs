"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function PublicNavbar() {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 shadow-md">
      <Link
        href="/"
        className="text-xl font-bold text-purple-700 dark:text-white"
      >
        Splitter
      </Link>

      <ThemeToggle />
    </header>
  );
}

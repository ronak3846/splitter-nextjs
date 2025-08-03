"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const links = [
    { name: "Home", href: "/dashboard" },
    { name: "Groups", href: "/dashboard/groups" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 fixed w-full z-50 top-0 left-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          Splitter
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 px-4 py-1.5 rounded text-sm"
          >
            Logout
          </button>
          <ThemeToggle /> {/* existing desktop toggle */}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-3">
          <ThemeToggle /> {/* add mobile toggle near hamburger */}
          <button
            className="text-gray-700 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-inner overflow-hidden"
          >
            <div className="flex flex-col space-y-2 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 px-3 py-1.5 rounded text-sm"
              >
                Logout
              </button>

              {/* Theme toggle inside mobile dropdown for easy access */}
              <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

}

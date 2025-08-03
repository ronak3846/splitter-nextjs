"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Wallet, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 
      bg-gradient-to-br from-purple-100 via-white to-blue-100 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      text-center text-black dark:text-white"
    >
      {/* Logo + Brand Name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 mb-6"
      >
        <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        <h1 className="text-4xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
          Splitter
        </h1>
      </motion.div>

      {/* Product Description */}
      <motion.p
        className="max-w-xl text-muted-foreground mb-10 text-base sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Effortlessly manage shared expenses with friends, roommates, or teams.
        Split bills, track balances, and settle up — all in one beautiful app.
      </motion.p>

      {/* Feature Cards */}
      <motion.div
        className="flex gap-4 flex-wrap justify-center mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[
          {
            icon: <Wallet className="w-8 h-8 text-blue-500 mb-2" />,
            title: "Split Expenses",
            desc: "Quickly log shared expenses and track who owes what.",
          },
          {
            icon: <Users className="w-8 h-8 text-purple-500 mb-2" />,
            title: "Group Friendly",
            desc: "Perfect for trips, events, and shared living — no account required for others.",
          },
          {
            icon: <Sparkles className="w-8 h-8 text-green-500 mb-2" />,
            title: "Simple & Clear",
            desc: "See who owes whom instantly. No confusion, just clarity.",
          },
        ].map(({ icon, title, desc }, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-lg p-6 w-64 flex flex-col items-center text-center"
          >
            {icon}
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button
          size="lg"
          className="rounded-full px-8 text-lg"
          onClick={() => router.push("/login")}
        >
          Log In
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-8 text-lg"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </Button>
        <ThemeToggle />
      </motion.div>
    </div>
  );
}

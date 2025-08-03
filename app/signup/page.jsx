"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      showError(data.error); // toast error
      return;
    }

    showSuccess("Account created successfully!"); // toast success
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70  dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Create an Account ✨
        </h2>

        {error && (
          <div className="text-sm text-red-500 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm">
              Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="pl-10"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobile" className="text-sm">
              Mobile Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="pl-10"
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">
            Sign Up
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer text-primary"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
        <ThemeToggle />
      </motion.div>
    </div>
  );
}

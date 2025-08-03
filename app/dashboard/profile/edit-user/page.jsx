"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForm({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Profile updated!");
      router.push("/dashboard/profile");
    } else {
      toast.error(data.error || "Failed to update");
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
        />
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}

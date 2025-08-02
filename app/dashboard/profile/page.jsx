"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }
console.log(token);
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log(res);
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        setUser(data);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to fetch profile.");
      }
    };

    fetchUser();
  }, []);

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">👤 My Profile</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <strong>Name:</strong> <span>{user.name}</span>
        </div>
        <div>
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div>
          <strong>Mobile:</strong> <span>{user.mobile}</span>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <Button className="w-full" onClick={() => router.push("/edit-user")}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}

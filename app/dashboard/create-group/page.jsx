"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/app/utils/toast";


export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Failed to create group.");
      return;
    }

    showSuccess("Group created successfully!");
    setName("");

    
    router.push("/dashboard/groups");
  };


  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6">Create New Group</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Goa Trip, College Friends"
          />
        </div>

        <Button type="submit" className="w-full">
          Create Group
        </Button>
      </form>
    </div>
  );
}

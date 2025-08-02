"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditGroupPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch(`/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      console.log(data)
      setName(data.name || "");
    };
    fetchGroup();
  }, []);

  const handleSubmit = async () => {
    await fetch(`/api/groups/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    });
    router.push(`/dashboard/`);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Edit Group</h1>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button className="mt-4" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}

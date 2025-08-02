"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { showError , showSuccess } from "@/app/utils/toast";



export default function AddExpensePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMembers(data.group.members);
      }
    };

    fetchGroup();
  }, [id]);

  const toggleSplitMember = (memberId) => {
    setSplitBetween((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/groups/${id}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        amount,
        paidBy,
        splitBetween,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Show success toast
      showSuccess("Expense added successfully!");

      // Clear the form
      setTitle("");
      setAmount("");
      setPaidBy("");
      setSplitBetween([]);
    } else {
      // ❌ Show error toast
      showError(data.error || "Failed to add expense.");
    }
  };


  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-xl font-bold mb-6">Add Expense</h2>

      

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dinner, Hotel"
            required
          />
        </div>

        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1000"
            required
          />
        </div>

        <div>
          <Label>Paid By</Label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="">Select</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Split Between</Label>
          <div className="flex flex-col gap-2">
            {members.map((member) => (
              <label key={member._id} className="flex items-center gap-2">
                <Checkbox
                  checked={splitBetween.includes(member._id)}
                  onCheckedChange={() => toggleSplitMember(member._id)}
                />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Expense
        </Button>
      </form>
    </div>
  );
}

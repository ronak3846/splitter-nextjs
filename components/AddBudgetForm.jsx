"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCurrentMonth } from "@/lib/dateUtils"; // e.g., returns "2025-08"

export default function AddBudgetForm({ onSetBudget }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          month: getCurrentMonth(),
        }),
      });

      if (!res.ok) throw new Error("Failed to set budget");
      const data = await res.json();
      toast.success("Budget saved");
      onSetBudget(data.amount);
    } catch (err) {
      toast.error("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-4">
      <Input
        type="number"
        placeholder="Enter monthly budget"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="max-w-sm"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Budget"}
      </Button>
    </form>
  );
}

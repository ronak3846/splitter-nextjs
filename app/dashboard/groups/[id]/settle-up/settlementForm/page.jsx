"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showSuccess , showError } from "@/app/utils/toast";
export default function SettleUpForm() {
  const { id } = useParams();
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data.group.members);
      }
    };

    fetchGroup();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (from === to) {
      showError("Payer and receiver must be different.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/groups/${id}/settlements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ from, to, amount, note, proofUrl }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to settle up");

      showSuccess("Settlement recorded successfully");
      router.push(`/dashboard/groups/${id}`);
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-xl font-bold mb-6">Settle Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Payer (From)</Label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Receiver (To)</Label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 500"
            required
          />
        </div>

        <div>
          <Label>Note (optional)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. UPI Payment"
          />
        </div>

        <div>
          <Label>Proof URL (optional)</Label>
          <Input
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="e.g. https://imgur.com/xyz"
          />
        </div>

        <Button type="submit" className="w-full">
          Record Settlement
        </Button>
      </form>
    </div>
  );
}

// export default function SettleUpPage() {
//   return <h1>Settle Up Page Works!</h1>;
// }


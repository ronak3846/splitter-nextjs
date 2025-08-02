// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function EditExpensePage() {
//   const { id, expenseId } = useParams();
//   const router = useRouter();
//   const [expense, setExpense] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [title, setTitle] = useState("");

//   useEffect(() => {
//     const fetchExpense = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`/api/groups/${id}/expenses/${expenseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setExpense(data);
//       setAmount(data.amount);
//       setTitle(data.title);
//     };

//     fetchExpense();
//   }, [expenseId]);

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");

//     await fetch(`/api/groups/${id}/expenses/${expenseId}/edit`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ title, amount }),
//     });

//     router.push(`/dashboard/groups/${id}`);
//   };

//   if (!expense) return <p>Loading...</p>;

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
//       <Input
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Title"
//       />
//       <Input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Amount"
//         className="mt-2"
//       />
//       <Button onClick={handleSubmit} className="mt-4">
//         Save
//       </Button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/app/utils/toast";

export default function EditExpensePage() {
  const { id: groupId, expenseId } = useParams();
  const router = useRouter();

  const [expense, setExpense] = useState(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const groupRes = await fetch(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groupData = await groupRes.json();
      setMembers(groupData.group.members || []);

      const expenseRes = await fetch(
        `/api/groups/${groupId}/expenses/${expenseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await expenseRes.json();
      setExpense(data);
      setTitle(data.title);
      setAmount(data.amount);
      setPaidBy(data.paidBy);
      setSplitBetween(data.splitBetween || []);
    };

    fetchData();
  }, [groupId, expenseId]);

  const handleToggleMember = (memberId) => {
    setSplitBetween((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

   const res = await fetch(`/api/groups/${groupId}/expenses/${expenseId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, amount, paidBy, splitBetween }),
    });

    if (res.ok) {
      showSuccess("Expense updated successfully!");
      setTimeout(() => {
        router.push(`/dashboard/groups/${groupId}`);
      }, 1000);
    } else {
      showError("Failed to update expense.");
    }
  };

  if (!expense || members.length === 0) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Expense</h2>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="mt-2"
      />

      <div className="mt-4">
        <label className="font-semibold">Paid By:</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        >
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="font-semibold">Split Between:</label>
        <div className="flex flex-col gap-1 mt-1">
          {members.map((member) => (
            <label key={member._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={member._id}
                checked={splitBetween.includes(member._id)}
                onChange={() => handleToggleMember(member._id)}
              />
              {member.name}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} className="mt-6 w-full">
        Save Changes
      </Button>
    </div>
  );
}

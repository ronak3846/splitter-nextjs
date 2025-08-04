// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { categoryOptions } from "@/lib/categoryOptions";
// import { toast } from "sonner";

// export default function EditPersonalExpense() {
//   const router = useRouter();
//   const params = useParams();
//   const { id } = params;

//   const [expense, setExpense] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch expense by ID
//   useEffect(() => {
//     async function fetchExpense() {
//       try {
//         const res = await fetch(`/api/personal-expenses/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to load expense");

//         const data = await res.json();
//         setExpense({
//           ...data,
//           category: data.category?.id || "", // ensure it's a string ID
//         });

//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load expense");
//       }
//     }

//     if (id) fetchExpense();
//   }, [id]);

//   const handleChange = (e) => {
//     setExpense((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(`/api/personal-expenses/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           ...expense,
//           category: expense.category, // already an ID now
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update expense");

//       toast.success("Expense updated");
//       router.push("/dashboard/personal-expenses");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ⚠️ Prevent rendering until data is fetched
//   if (!expense) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Personal Expense</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Title</Label>
//           <Input
//             name="title"
//             value={expense.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <Label>Amount (₹)</Label>
//           <Input
//             type="number"
//             name="amount"
//             value={expense.amount}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <Label>Category</Label>
//           <select
//             name="category"
//             value={expense.category}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 w-full"
//             required
//           >
//             <option value="">Select category</option>
//             {categoryOptions.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.icon} {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <Label>Date</Label>
//           <Input
//             type="date"
//             name="date"
//             value={expense.date.slice(0, 10)} // YYYY-MM-DD
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <Label>Notes</Label>
//           <Textarea
//             name="notes"
//             value={expense.notes}
//             onChange={handleChange}
//           />
//         </div>

//         <Button type="submit" disabled={loading}>
//           {loading ? "Updating..." : "Update Expense"}
//         </Button>
//       </form>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoryOptions } from "@/lib/categoryOptions";
import { toast } from "sonner";

export default function EditPersonalExpense() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch expense by ID
  useEffect(() => {
    async function fetchExpense() {
      try {
        const res = await fetch(`/api/personal-expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load expense");

        const data = await res.json();
        setExpense({
          ...data,
          category: data.category?.id || "", // store category as ID only
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load expense");
      }
    }

    if (id) fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setExpense((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert selected category ID back into full object
      const selectedCategory = categoryOptions.find(
        (cat) => cat.id === expense.category
      );

      const updatedExpense = {
        ...expense,
        category: selectedCategory, // full object required by backend
      };

      const res = await fetch(`/api/personal-expenses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedExpense),
      });

      if (!res.ok) throw new Error("Failed to update expense");

      toast.success("Expense updated");
      router.push("/dashboard/personal-expenses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!expense) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Personal Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            value={expense.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Amount (₹)</Label>
          <Input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Category</Label>
          <select
            name="category"
            value={expense.category}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            value={expense.date.slice(0, 10)}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            name="notes"
            value={expense.notes}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Expense"}
        </Button>
      </form>
    </div>
  );
}

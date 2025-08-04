// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { categoryOptions } from "@/lib/categoryOptions";


// export default function NewPersonalExpensePage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     title: "",
//     amount: "",
//     category: "",
//     date: "",
//     notes: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/personal-expenses", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to add expense");

//       toast.success("Expense added successfully");
//       router.push("/dashboard/personal-expenses");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add expense");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Add New Personal Expense</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Title</Label>
//           <Input
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <Label>Amount (₹)</Label>
//           <Input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label>Category</label>
//           <select
//             value={form.category}
//             onChange={(e) => setForm({ ...form, category: e.target.value })}
//             className="border rounded px-3 py-2 w-full"
//           >
//             <option value="">Select category</option>
//             {categoryOptions.map((cat) => (
//               <option key={cat.id} value={cat.name}>
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
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <Label>Notes</Label>
//           <Textarea
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//           />
//         </div>

//         <Button type="submit" disabled={loading}>
//           {loading ? "Adding..." : "Add Expense"}
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { categoryOptions } from "@/lib/categoryOptions";

export default function NewPersonalExpensePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "", // now an object
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selected = categoryOptions.find((cat) => cat.id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      category: selected || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    


    try {
      const res = await fetch("/api/personal-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      toast.success("Expense added successfully");
      router.push("/dashboard/personal-expenses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };
console.log("Submitting data:", formData);
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Personal Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Amount (₹)</Label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div>
            <Label>Category</Label>
            <select
              name="category"
              value={formData.category?.id || ""}
              onChange={(e) => {
                const selected = categoryOptions.find(
                  (cat) => cat.id === e.target.value
                );
                setFormData((prev) => ({
                  ...prev,
                  category: selected || null,
                }));
              }}
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
        </div>

        <div>
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    </div>
  );
}



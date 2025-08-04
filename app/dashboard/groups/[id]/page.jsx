// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Users,
//   Trash2,
//   Wallet,
//   Pencil,
//   UserPlus,
//   PlusCircle,
//   ScrollText,
//   BadgeIndianRupee,
//   CircleChevronRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";


// export default function GroupDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [group, setGroup] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [totalExpense, setTotalExpense] = useState(0);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchGroup = async () => {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`/api/groups/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         router.push("/dashboard/groups");
//         return;
//       }

//       setGroup(data.group);
//       setExpenses(data.expenses);
//       setSummary(data.summary);
//       const total = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
//       setTotalExpense(total);
//       setLoading(false);
//     };

//     fetchGroup();
//   }, [id, router]);

//   const handleDeleteMember = async (memberId, memberName) => {
//     const confirm = window.confirm(`Delete member ${memberName}?`);
//     if (!confirm) return;

//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`/api/groups/${id}/members/${memberId}/delete`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Delete failed");
//       }

//       router.refresh();
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleDeleteGroup = async (groupId) => {
//     const confirmed = confirm("Are you sure you want to delete this group?");
//     if (!confirmed) return;

//     try {
//       const res = await fetch(`/api/groups/${groupId}/delete-group`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data?.error || "Failed to delete group.");
//         return;
//       }

//       alert(data?.message || "Group deleted.");
//       setGroup((prev) => prev.filter((g) => g._id !== groupId));
//     } catch (err) {
//       console.error("Delete group error:", err);
//       alert("Something went wrong.");
//     }
//   };


//   function calculateSettlements(summary) {
//     const creditors = [];
//     const debtors = [];

//     Object.values(summary).forEach((member) => {
//       if (member.balance > 0) creditors.push({ ...member });
//       else if (member.balance < 0) debtors.push({ ...member });
//     });

//     const settlements = [];

//     while (creditors.length && debtors.length) {
//       const creditor = creditors[0];
//       const debtor = debtors[0];

//       const amount = Math.min(creditor.balance, -debtor.balance);

//       settlements.push({
//         from: debtor.name,
//         to: creditor.name,
//         amount,
//       });

//       creditor.balance -= amount;
//       debtor.balance += amount;

//       if (creditor.balance === 0) creditors.shift();
//       if (debtor.balance === 0) debtors.shift();
//     }

//     return settlements;
//   }

//   if (loading) return <p className="text-center mt-10">Loading group...</p>;
//   if (!group) return <p className="text-center mt-10">Group not found</p>;

  // return (
//     <div className="max-w-4xl mx-auto mt-16 space-y-6 px-4">
//       {/* Group Name Card */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         <Card className="bg-muted border-0 shadow-sm">
//           <CardContent className="p-6 flex items-center gap-3">
//             <Users className="w-7 h-7 text-primary" />
//             <h2 className="text-2xl md:text-3xl font-bold text-primary">
//               {group.name}
//             </h2>
//             <div className="mt-4 flex justify-end">
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => handleDeleteGroup(group._id)}
//               >
//                 Delete
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Total Expense Card */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.1 }}
//       >
//         <Card className="bg-green-50 border border-green-200 shadow-sm">
//           <CardContent className="p-6 flex items-center gap-3">
//             <BadgeIndianRupee className="w-7 h-7 text-green-600" />
//             <div>
//               <p className="text-lg font-semibold text-green-700">
//                 Total Expense
//               </p>
//               <p className="text-2xl font-bold text-green-900">
//                 ₹{totalExpense}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Members List */}
//       <Card className="shadow-md rounded-2xl">
//         <CardContent className="p-5 space-y-3">
//           <h3 className="font-semibold text-lg flex items-center gap-2">
//             <UserPlus className="w-4 h-4" />
//             Members
//           </h3>
//           <ul className="grid gap-2">
//             {group.members.map((member) => (
//               <li
//                 key={member._id}
//                 className="flex justify-between items-center bg-muted/50 rounded-md p-2"
//               >
//                 <span>
//                   {member.name}{" "}
//                   <span className="text-gray-500">({member.email})</span>
//                 </span>
//                 <Button
//                   variant="destructive"
//                   size="icon"
//                   onClick={async () => {
//                     const confirm = window.confirm(
//                       `Delete member ${member.name}?`
//                     );
//                     if (!confirm) return;

//                     const token = localStorage.getItem("token");
//                     const res = await fetch(
//                       `/api/groups/${id}/members/${member._id}/delete`,
//                       {
//                         method: "DELETE",
//                         headers: { Authorization: `Bearer ${token}` },
//                       }
//                     );

//                     if (res.ok) router.refresh();
//                     else {
//                       const errorData = await res.json();
//                       alert(errorData.error || "Delete failed");
//                     }
//                   }}
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Expenses List */}
//       <Card className="shadow-md rounded-2xl">
//         <CardContent className="p-5 space-y-3">
//           <h3 className="font-semibold text-lg flex items-center gap-2">
//             <Wallet className="w-4 h-4" />
//             Expenses
//           </h3>
//           {expenses.length ? (
//             <ul className="grid gap-3">
//               {expenses.map((expense) => (
//                 <li
//                   key={expense._id}
//                   className="flex justify-between items-center bg-muted/40 p-3 rounded-md"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       💸 {expense.title} — ₹{expense.amount}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Paid by: {expense.paidBy?.name || "Unknown"}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       onClick={() =>
//                         handleDeleteMember(member._id, member.name)
//                       }
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>

//                     <Button
//                       size="icon"
//                       variant="outline"
//                       onClick={() =>
//                         router.push(
//                           `/dashboard/groups/${id}/edit-expense/${expense._id}`
//                         )
//                       }
//                     >
//                       <Pencil className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-muted-foreground">No expenses yet.</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Summary */}
//       {summary && (
//         <Card className="rounded-2xl shadow-sm">
//           <CardContent className="p-5">
//             <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
//               <BadgeIndianRupee className="w-4 h-4" />
//               Summary
//             </h3>
//             <ul className="grid gap-2 text-sm">
//               {Object.entries(summary).map(([id, member]) => (
//                 <li key={id}>
//                   <strong>{member.name}</strong> → Paid: ₹{member.paid}, Owes: ₹
//                   {member.owes}, Balance:{" "}
//                   <span
//                     className={
//                       member.balance >= 0 ? "text-green-600" : "text-red-600"
//                     }
//                   >
//                     ₹{member.balance}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       )}

//       {/* Who Owes Whom */}
//       {summary && (
//         <Card className="rounded-2xl shadow-sm">
//           <CardContent className="p-5">
//             <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
//               <ScrollText className="w-4 h-4" />
//               Who Owes Whom
//             </h3>
//             <ul className="grid gap-2 text-sm">
//               {calculateSettlements(summary).map((s, index) => (
//                 <li key={index}>
//                   <span className="text-muted-foreground">
//                     {s.from} owes {s.to} <strong>₹{s.amount}</strong>
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       )}

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
//         <Button
//           onClick={() => router.push(`/dashboard/groups/${id}/add-member`)}
//         >
//           <UserPlus className="w-4 h-4 mr-2" />
//           Add Member
//         </Button>
//         <Button
//           onClick={() => router.push(`/dashboard/groups/${id}/add-expense`)}
//         >
//           <PlusCircle className="w-4 h-4 mr-2" />
//           Add Expense
//         </Button>
//         <Button
//           onClick={() => router.push(`/dashboard/groups/${id}/settle-up`)}
//         >
//           <CircleChevronRight className="w-4 h-4 mr-2" />
//           Settle Up
//         </Button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Trash2,
  Wallet,
  Pencil,
  UserPlus,
  PlusCircle,
  ScrollText,
  BadgeIndianRupee,
  CircleChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#D65DB1",
];

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        router.push("/dashboard/groups");
        return;
      }

      setGroup(data.group);
      setExpenses(data.expenses);
      setSummary(data.summary);
      const total = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpense(total);
      setLoading(false);
    };

    fetchGroup();
  }, [id, router]);

  const handleDeleteMember = async (memberId, memberName) => {
    const confirm = window.confirm(`Delete member ${memberName}?`);
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/groups/${id}/members/${memberId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Delete failed");
      }

      router.refresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    const confirmed = confirm("Are you sure you want to delete this group?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/delete-group`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to delete group.");
        return;
      }

      alert(data?.message || "Group deleted.");
      setGroup((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      console.error("Delete group error:", err);
      alert("Something went wrong.");
    }
  };

  function calculateSettlements(summary) {
    const creditors = [];
    const debtors = [];

    Object.values(summary).forEach((member) => {
      if (member.balance > 0) creditors.push({ ...member });
      else if (member.balance < 0) debtors.push({ ...member });
    });

    const settlements = [];

    while (creditors.length && debtors.length) {
      const creditor = creditors[0];
      const debtor = debtors[0];

      const amount = Math.min(creditor.balance, -debtor.balance);

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance === 0) creditors.shift();
      if (debtor.balance === 0) debtors.shift();
    }

    return settlements;
  }

  if (loading) return <p className="text-center mt-10">Loading group...</p>;
  if (!group) return <p className="text-center mt-10">Group not found</p>;

  const paidChartData = group.members.map((member) => ({
    name: member.name,
    value: summary?.[member._id]?.paid || 0,
  }));

  const expenseChartData = expenses.map((exp) => ({
    name: exp.title,
    value: exp.amount,
  }));

  return (
    <div className="max-w-4xl mx-auto mt-16 space-y-6 px-4">
      {/* Group Name Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-muted border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              {group.name}
            </h2>
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteGroup(group._id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Expense Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-green-50 border border-green-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-3">
            <BadgeIndianRupee className="w-7 h-7 text-green-600" />
            <div>
              <p className="text-lg font-semibold text-green-700">
                Total Expense
              </p>
              <p className="text-2xl font-bold text-green-900">
                ₹{totalExpense}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        {/* Member Contributions Chart */}
        <Card className="shadow rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold text-base mb-2 text-center">
              Member Contributions
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={paidChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {paidChartData.map((_, index) => (
                    <Cell
                      key={`cell-member-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={30}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card className="shadow rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold text-base mb-2 text-center">
              Expense Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {expenseChartData.map((_, index) => (
                    <Cell
                      key={`cell-expense-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={30}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card className="shadow-md rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Members
          </h3>
          <ul className="grid gap-2">
            {group.members.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center bg-muted/50 rounded-md p-2"
              >
                <span>
                  {member.name}{" "}
                  <span className="text-gray-500">({member.email})</span>
                </span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    const confirm = window.confirm(
                      `Delete member ${member.name}?`
                    );
                    if (!confirm) return;

                    const token = localStorage.getItem("token");
                    const res = await fetch(
                      `/api/groups/${id}/members/${member._id}/delete`,
                      {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );

                    if (res.ok) router.refresh();
                    else {
                      const errorData = await res.json();
                      alert(errorData.error || "Delete failed");
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card className="shadow-md rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Expenses
          </h3>
          {expenses.length ? (
            <ul className="grid gap-3">
              {expenses.map((expense) => (
                <li
                  key={expense._id}
                  className="flex justify-between items-center bg-muted/40 p-3 rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      💸 {expense.title} — ₹{expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Paid by: {expense.paidBy?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleDeleteMember(member._id, member.name)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/groups/${id}/edit-expense/${expense._id}`
                        )
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No expenses yet.</p>
          )}
        </CardContent>
        {/* Member Contribution Pie Chart */}
      </Card>

      {/* Summary */}
      {summary && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
              <BadgeIndianRupee className="w-4 h-4" />
              Summary
            </h3>
            <ul className="grid gap-2 text-sm">
              {Object.entries(summary).map(([id, member]) => (
                <li key={id}>
                  <strong>{member.name}</strong> → Paid: ₹
                  {member.paid.toFixed(2)}, Owes: ₹{member.owes.toFixed(2)},
                  Balance:{" "}
                  <span
                    className={
                      member.balance >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ₹{member.balance.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Who Owes Whom */}
      {summary && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
              <ScrollText className="w-4 h-4" />
              Who Owes Whom
            </h3>
            <ul className="grid gap-2 text-sm">
              {calculateSettlements(summary).map((s, index) => (
                <li key={index}>
                  <span className="text-muted-foreground">
                    {s.from} owes {s.to} <strong>₹{s.amount}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
        <Button
          onClick={() => router.push(`/dashboard/groups/${id}/add-member`)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/groups/${id}/add-expense`)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/groups/${id}/settle-up`)}
        >
          <CircleChevronRight className="w-4 h-4 mr-2" />
          Settle Up
        </Button>
      </div>
    </div>
  );
}

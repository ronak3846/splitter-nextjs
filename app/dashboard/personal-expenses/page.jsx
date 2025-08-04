"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format, isThisMonth, isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, Pencil, Trash, Calendar, Tag, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddBudgetForm from "@/components/AddBudgetForm";
import BudgetSummary from "@/components/BudgetSummary";
import { getCurrentMonth } from "@/lib/dateUtils";



export default function PersonalExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [todaySpent, setTodaySpent] = useState(0);

  
   const [budget, setBudget] = useState(null);

  const [search, setSearch] = useState("");

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/personal-expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data = await res.json();
      const allExpenses = data.expenses || [];
      setExpenses(allExpenses);

      let total = 0,
        month = 0,
        today = 0;
      allExpenses.forEach((exp) => {
        const amt = Number(exp.amount);
        const date = new Date(exp.date);
        total += amt;
        if (isThisMonth(date)) month += amt;
        if (isToday(date)) today += amt;
      });

      setTotalSpent(total);
      setMonthlySpent(month);
      setTodaySpent(today);
    } catch (err) {
      console.error("Error fetching personal expenses:", err);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch(`/api/budget?month=${getCurrentMonth()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (data?.amount) {
          setBudget(data.amount); // ✅ This should trigger BudgetSummary
        } else {
          setBudget(null); // No budget set yet
        }
      } catch (error) {
        console.error("Failed to fetch budget", error);
      }
    }

    fetchBudget();
  }, []);


  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`/api/personal-expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong!");
    }
  };

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Personal Expenses</h2>
        <Button onClick={() => router.push("/dashboard/personal-expenses/new")}>
          + Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      {!loading && !error && expenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <IndianRupee className="text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-xl font-bold">
                  {formatCurrency(totalSpent)}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <Calendar className="text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">This Month</div>
                <div className="text-xl font-bold">
                  {formatCurrency(monthlySpent)}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <Calendar className="text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="text-xl font-bold">
                  {formatCurrency(todaySpent)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Expense Table */}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <IndianRupee className="w-10 h-10 opacity-50" />
          <p>No matching expenses found.</p>
        </div>
      ) : (
        <div className="w-full mt-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Notes</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-muted transition">
                    <td className="px-6 py-3">{expense.title}</td>
                    <td className="px-6 py-3 font-medium text-green-700 dark:text-green-400">
                      ₹
                      {expense.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-2 capitalize">
                      {expense.category?.icon && (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: expense.category.icon,
                          }}
                          className="w-5 h-5"
                        />
                      )}
                      {expense.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-3">
                      {format(new Date(expense.date), "EEE, dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {expense.notes || "-"}
                    </td>
                    <td className="px-6 py-3 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/personal-expenses/edit/${expense._id}`
                          )
                        }
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(expense._id)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white dark:bg-[#0f0f0f] shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🎯 Monthly Budget Management
        </h1>

        {/* Budget Form */}
        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Set Your Budget
          </h2>
          <AddBudgetForm onSetBudget={setBudget} />
        </div>

        {/* Budget Summary */}
        {budget && (
          <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <BudgetSummary budget={budget} spent={monthlySpent} />
          </div>
        )}
      </div>
    </div>
  );
}

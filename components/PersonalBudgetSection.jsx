"use client";
import { useEffect, useState } from "react";
import AddBudgetForm from "@/components/AddBudgetForm";
import BudgetSummary from "@/components/BudgetSummary";
import { getCurrentMonth } from "@/lib/dateUtils";

export default function PersonalBudgetSection({ monthlySpent }) {
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    async function fetchBudget() {
      const res = await fetch(`/api/budget?month=${getCurrentMonth()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data?.amount) setBudget(data.amount);
    }

    fetchBudget();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto space-y-4">
      <AddBudgetForm onSetBudget={setBudget} />
      {budget && <BudgetSummary budget={budget} spent={monthlySpent} />}
    </div>
  );
}

// "use client";

// import { Card, CardContent } from "./ui/card";
// import { AlertTriangle } from "lucide-react";

// export default function BudgetSummary({ budget, spent }) {
//   const remaining = budget - spent;
//   const isOverBudget = remaining < 0;

//   return (
//     <Card className="max-w-md shadow-sm mb-4 border">
//       <CardContent className="p-4">
//         <h3 className="text-lg font-semibold mb-2">Budget Summary</h3>
//         <p>
//           <strong>Budget:</strong> ₹{budget.toLocaleString("en-IN")}
//         </p>
//         <p>
//           <strong>Spent:</strong> ₹{spent.toLocaleString("en-IN")}
//         </p>
//         <p
//           className={
//             isOverBudget
//               ? "text-red-600 font-semibold"
//               : "text-green-600 font-semibold"
//           }
//         >
//           {isOverBudget
//             ? `Over Budget by ₹${Math.abs(remaining).toLocaleString("en-IN")}`
//             : `Remaining: ₹${remaining.toLocaleString("en-IN")}`}
//         </p>
//         {isOverBudget && (
//           <div className="mt-2 flex items-center text-red-500 text-sm">
//             <AlertTriangle className="w-4 h-4 mr-1" />
//             Consider cutting back to stay on track!
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Wallet, Activity } from "lucide-react";

export default function BudgetSummary({ budget, spent }) {
  const remaining = budget - spent;
  const isOver = remaining < 0;

  return (
    <Card className="shadow-xl rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">
          💰 Monthly Budget Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-3 border border-gray-100">
            <Wallet className="text-blue-600 w-5 h-5" />
            <div>
              <p className="text-gray-500">Budget</p>
              <p className="font-semibold text-blue-800">
                ₹{budget.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-3 border border-gray-100">
            <Activity className="text-orange-500 w-5 h-5" />
            <div>
              <p className="text-gray-500">Spent</p>
              <p className="font-semibold text-orange-700">
                ₹{spent.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-3 border border-gray-100">
            <TrendingUp
              className={
                isOver ? "text-red-600 w-5 h-5" : "text-green-600 w-5 h-5"
              }
            />
            <div>
              <p className="text-gray-500">
                {isOver ? "Over Budget" : "Remaining"}
              </p>
              <p
                className={`font-semibold ${
                  isOver ? "text-red-600" : "text-green-700"
                }`}
              >
                ₹{Math.abs(remaining).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {isOver && (
          <div className="mt-3 flex items-center text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warning: You’ve exceeded your budget. Time to cut back!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

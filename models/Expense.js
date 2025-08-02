// models/Expense.js
import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);

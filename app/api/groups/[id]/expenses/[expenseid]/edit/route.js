import { connectDB } from "@/lib/db";
import Expense from "@/models/Expense";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();

  const { expenseid } = params;
  const body = await req.json();
  
  const { title, amount, paidBy, splitBetween } = body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseid,
      {
        title,
        amount,
        paidBy,
        splitBetween,
      },
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (err) {
    console.error("Edit expense error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

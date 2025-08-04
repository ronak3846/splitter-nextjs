import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Budget from "@/models/Budget";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = verifyToken(token);
    const userId = decoded._id;

    console.log("Decoded Token:", decoded);
    console.log("user:", userId);


    const { amount, month } = await req.json();

    let existing = await Budget.findOne({ userId, month });
    if (existing) {
      existing.budgetAmount = amount; // <- match field name
      await existing.save();
    } else {
      await Budget.create({ userId, budgetAmount: amount, month });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving budget:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save budget" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = verifyToken(token);
    const userId = decoded._id;

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const budget = await Budget.findOne({ userId, month });

    if (!budget) {
      return NextResponse.json({});
    }

    return NextResponse.json({
      amount: budget.budgetAmount, // ✅ fixed field
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

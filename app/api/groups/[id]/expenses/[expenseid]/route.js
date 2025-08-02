import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import Expense from "@/models/Expense";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  const { id, expenseid } = params; // ✅ FIXED

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  try {
    // Check if user has access to the group
    const group = await Group.findOne({
      _id: id,
      $or: [{ createdBy: decoded._id }, { "members.email": decoded.email }],
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 403 }
      );
    }

    // Find the expense
    const expense = await Expense.findOne({ _id: expenseid, group: id });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (err) {
    console.error("Fetch expense error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

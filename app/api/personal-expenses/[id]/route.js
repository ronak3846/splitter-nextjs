import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import PersonalExpense from "@/models/PersonalExpense";
import { NextResponse } from "next/server";

// GET expense by ID
export async function GET(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expense = await PersonalExpense.findOne({
      _id: params.id,
      userId: user._id,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PATCH to edit an expense
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await PersonalExpense.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", updated });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE already implemented previously

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expenseId = params.id;

    const deleted = await PersonalExpense.findOneAndDelete({
      _id: expenseId,
      userId: user._id,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

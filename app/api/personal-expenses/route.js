import { connectDB } from "@/lib/db";
import PersonalExpense from "@/models/PersonalExpense";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, amount, category, date } = body;
    console.log("Request body:", body);


    // Check for proper category structure
    if (!category || !category.id || !category.name || !category.icon) {
      return NextResponse.json(
        { error: "Invalid category format" },
        { status: 400 }
      );
    }

    const newExpense = new PersonalExpense({
      userId: user._id,
      title,
      amount,
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
      },
      date: date || new Date(),
    });

    await newExpense.save();

    return NextResponse.json({ success: true, data: newExpense });
  } catch (err) {
    console.error("Personal Expense POST Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token); // ✅ FIX: assign result to `user`

    const expenses = await PersonalExpense.find({
      userId: user._id, // ✅ Use correct property
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Fetch expenses error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

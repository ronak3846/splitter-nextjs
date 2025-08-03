import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // adjust this to your actual DB file
import User from "@/models/User"; // your User model
import { verifyToken } from "@/lib/auth"; // your JWT decoder

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyToken(token);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await verifyToken(token);
    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
    }).select("-password");

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
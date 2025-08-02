import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import Settlement from "@/models/Settlement";
import { verifyToken } from "@/lib/auth"; // ✅ your JWT utility

export async function POST(req, context) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user;
    try {
      user = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const groupId = context.params.id;
    const body = await req.json();
    const { from, to, amount, note, proofUrl } = body;

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const fromMember = group.members.find((m) => m._id.toString() === from);
    const toMember = group.members.find((m) => m._id.toString() === to);

    if (!fromMember || !toMember) {
      return NextResponse.json(
        { error: "Member not found in group" },
        { status: 400 }
      );
    }

    const settlement = new Settlement({
      group: groupId,
      from,
      to,
      amount,
      note,
      proofUrl,
    });

    await settlement.save();

    return NextResponse.json({ message: "Settlement recorded", settlement });
  } catch (err) {
    console.error("💥 API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}


export async function GET(req, context) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const groupId = await  context.params.id;

  const settlements = await Settlement.find({ group: groupId }).sort({
    createdAt: -1,
  });

  return NextResponse.json(settlements);
}
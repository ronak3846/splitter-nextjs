import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import { verifyToken } from "@/lib/auth";

export async function POST(req, context) {
  try {
    await connectDB();

    const groupId = (await context.params).id; // ✅ Fix here
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email required" }),
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const group = await Group.findOne({
      _id: groupId,
      createdBy: decoded._id,
    });

    if (!group) {
      return new Response(
        JSON.stringify({ error: "Group not found or access denied" }),
        { status: 404 }
      );
    }

    const alreadyExists = group.members.some(
      (member) => member.email === email
    );

    if (alreadyExists) {
      return new Response(JSON.stringify({ error: "Member already added" }), {
        status: 400,
      });
    }

    const newMember = {
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
    };

    console.log("Adding member:", newMember);
    console.log("Validated member values:", { name, email });
    console.log("Type checks:", typeof name, typeof email);


    group.members.push(newMember);
    await group.save();

    return new Response(
      JSON.stringify({ message: "Member added successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error adding member:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

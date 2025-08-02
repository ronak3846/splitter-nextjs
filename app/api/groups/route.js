import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);

    const groups = await Group.find({
      $or: [{ createdBy: decoded._id }, { "members.email": decoded.email }],
    });

    return new Response(JSON.stringify({ groups }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    

    const { name } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: "Group name is required" }), {
        status: 400,
      });
    }

    if (!decoded?.name || !decoded?.email) {
      return new Response(JSON.stringify({ error: "Invalid user info" }), {
        status: 400,
      });
    }
console.log("Decoded:", decoded);
    const group = await Group.create({
      name,
      members: [{ name: decoded.name, email: decoded.email }],
      createdBy: decoded._id,
    });

    return new Response(JSON.stringify({ group }), { status: 201 });
  } catch (err) {
    console.error("Create group error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

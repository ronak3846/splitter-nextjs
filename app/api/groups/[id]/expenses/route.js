// import { connectDB } from "@/lib/db";
// import Group from "@/models/Group";
// import Expense from "@/models/Expense";
// import { verifyToken } from "@/lib/auth";

// export async function POST(req, { params }) {
//   try {
//     await connectDB();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const user = verifyToken(token);

//     const { title, amount, paidBy, splitBetween } = await req.json();

//     if (!title || !amount || !paidBy || !splitBetween.length) {
//       return new Response(JSON.stringify({ error: "Missing fields" }), {
//         status: 400,
//       });
//     }

//     const group = await Group.findOne({
//       _id: params.id,
//       members: user._id,
//     });

//     if (!group) {
//       return new Response(JSON.stringify({ error: "Group not found" }), {
//         status: 404,
//       });
//     }

//     const expense = new Expense({
//       title,
//       amount,
//       paidBy,
//       splitBetween,
//       group: group._id,
//       createdBy: user._id,
//     });

//     await expense.save();

//     return new Response(JSON.stringify({ message: "Expense added", expense }), {
//       status: 200,
//     });
//   } catch (err) {
//     console.error("Add expense error:", err);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }

// import { connectDB } from "@/lib/db";
// import Group from "@/models/Group";
// import Expense from "@/models/Expense";
// import { verifyToken } from "@/lib/auth";
// import mongoose from "mongoose";


// export async function POST(req, { params }) {
//   try {
//     await connectDB();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const user = verifyToken(token);

//     const { title, amount, paidBy, splitBetween } = await req.json();

//     if (!title || !amount || !paidBy || !splitBetween?.length) {
//       return new Response(JSON.stringify({ error: "Missing fields" }), {
//         status: 400,
//       });
//     }

//     const group = await Group.findOne({
//       _id: params.id,
//       "members.email": user.email, // ✅ Fix here
//     });

//     if (!group) {
//       return new Response(JSON.stringify({ error: "Group not found" }), {
//         status: 404,
//       });
//     }
// const paidByObjectId = new mongoose.Types.ObjectId(paidBy);
// const splitBetweenIds = splitBetween.map(
//   (id) => new mongoose.Types.ObjectId(id)
// );

//    const expense = new Expense({
//      title,
//      amount,
//      paidBy: paidByObjectId,
//      splitBetween: splitBetweenIds,
//      group: group._id,
//      createdBy: user._id,
//    });


//     await expense.save();

//     return new Response(JSON.stringify({ message: "Expense added", expense }), {
//       status: 200,
//     });
//   } catch (err) {
//     console.error("Add expense error:", err);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }

import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import Expense from "@/models/Expense";
import { verifyToken } from "@/lib/auth";

export async function POST(req, { params }) {
  await connectDB();

  const { id } = params;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  const body = await req.json();
  const { title, amount, paidBy, splitBetween } = body;

  try {
    const group = await Group.findOne({
      _id: id,
      $or: [{ createdBy: decoded._id }, { "members.email": decoded.email }],
    });

    if (!group) {
      return new Response(
        JSON.stringify({ error: "Group not found or access denied" }),
        { status: 403 }
      );
    }

    const expense = await Expense.create({
      group: group._id,
      title,
      amount,
      paidBy,
      splitBetween,
    });

    return new Response(JSON.stringify(expense), { status: 201 });
  } catch (err) {
    console.error("Create expense error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

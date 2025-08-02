// import { connectDB } from "@/lib/db";
// import Group from "@/models/Group";
// import Expense from "@/models/Expense";
// import { verifyToken } from "@/lib/auth";

// export async function GET(req, context) {
//   try {
//     await connectDB();

//     const { params } = context;

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);

//     const group = await Group.findOne({
//       _id: params.id,
//       $or: [{ createdBy: decoded._id }, { "members.email": decoded.email }],
//     });

//     if (!group) {
//       return new Response(
//         JSON.stringify({ error: "Group not found or access denied" }),
//         { status: 404 }
//       );
//     }

//     // ✅ Populate expenses with paidBy and splitBetween user info
//     const expensesRaw = await Expense.find({ group: group._id });

//     const membersMap = {};
//     group.members.forEach((m) => {
//       membersMap[String(m._id)] = m;
//     });

//     const expenses = expensesRaw.map((expense) => ({
//       ...expense.toObject(),
//       paidBy: membersMap[String(expense.paidBy)] || null,
//       splitBetween: expense.splitBetween.map(
//         (id) => membersMap[String(id)] || null
//       ),
//     }));

    

//     // After fetching expenses and group
//     const summary = {};

//     group.members.forEach((member) => {
//       summary[member._id.toString()] = {
//         name: member.name,
//         email: member.email,
//         paid: 0,
//         owes: 0,
//         balance: 0,
//       };
//     });

//     expenses.forEach((expense) => {
//       const payerId = expense.paidBy._id.toString();
//       const splitCount = expense.splitBetween.length;
//       const splitAmount = expense.amount / splitCount;

//       // Add to payer
//       if (summary[payerId]) {
//         summary[payerId].paid += expense.amount;
//       }

//       // Add to owes for each person in split
//       expense.splitBetween.forEach((member) => {
//         const memberId = member._id.toString();
//         if (summary[memberId]) {
//           summary[memberId].owes += splitAmount;
//         }
//       });
//     });

//     // Calculate net balance
//     Object.values(summary).forEach((entry) => {
//       entry.balance = entry.paid - entry.owes;
//     });

//     // 🧼 Return complete group + expenses
//     return new Response(JSON.stringify({ group, expenses, summary }), {
//       status: 200,
//     });

//   } catch (err) {
//     console.error("Group detail error:", err);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }


import { connectDB } from "@/lib/db";
import Group from "@/models/Group";
import Expense from "@/models/Expense";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await connectDB();

    // ✅ Wait until after connectDB to access context.params
    const params = await context.params;
    const groupId = params.id;

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
      $or: [{ createdBy: decoded._id }, { "members.email": decoded.email }],
    });

    if (!group) {
      return new Response(
        JSON.stringify({ error: "Group not found or access denied" }),
        { status: 404 }
      );
    }

    const expensesRaw = await Expense.find({ group: group._id });

    const membersMap = {};
    group.members.forEach((m) => {
      membersMap[String(m._id)] = m;
    });

    const expenses = expensesRaw.map((expense) => ({
      ...expense.toObject(),
      paidBy: membersMap[String(expense.paidBy)] || null,
      splitBetween: expense.splitBetween.map(
        (id) => membersMap[String(id)] || null
      ),
    }));

    const summary = {};

    group.members.forEach((member) => {
      summary[member._id.toString()] = {
        name: member.name,
        email: member.email,
        paid: 0,
        owes: 0,
        balance: 0,
      };
    });

    expenses.forEach((expense) => {
      const payerId = expense.paidBy._id.toString();
      const splitCount = expense.splitBetween.length;
      const splitAmount = expense.amount / splitCount;

      if (summary[payerId]) {
        summary[payerId].paid += expense.amount;
      }

      expense.splitBetween.forEach((member) => {
        const memberId = member._id.toString();
        if (summary[memberId]) {
          summary[memberId].owes += splitAmount;
        }
      });
    });

    Object.values(summary).forEach((entry) => {
      entry.balance = entry.paid - entry.owes;
    });

    return new Response(JSON.stringify({ group, expenses, summary }), {
      status: 200,
    });


  } catch (err) {
    console.error("Group detail error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}


export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Group updated", group: updatedGroup });
  } catch (error) {
    console.error("Update group error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    // Delete all related expenses
    await Expense.deleteMany({ group: id });

    // Delete the group
    await Group.findByIdAndDelete(id);

    return NextResponse.json({ message: "Group deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Error deleting group" },
      { status: 500 }
    );
  }
}

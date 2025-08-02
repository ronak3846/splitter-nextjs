// // app/api/groups/[id]/expenses/[expenseid]/delete/route.js

// import { connectDB } from "@/lib/db";
// import Expense from "@/models/Expense";
// import { NextResponse } from "next/server";

// export async function DELETE(req, { params }) {
//   await connectDB();

//   const { id, expenseid } = params; // ✅ correctly use both

//   try {
//     const deleted = await Expense.findOneAndDelete({
//       _id: expenseid,
//       group: id,
//     });

//     if (!deleted) {
//       return NextResponse.json({ error: "Expense not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Expense deleted successfully" });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// app/api/groups/[id]/expenses/[expenseid]/delete/route.js

import { connectDB } from "@/lib/db";
import Expense from "@/models/Expense";

export async function DELETE(req, { params }) {
  await connectDB();

  const { expenseid } = await params;

  try {
    const deleted = await Expense.findByIdAndDelete(expenseid);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Expense not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Expense deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Delete expense error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}


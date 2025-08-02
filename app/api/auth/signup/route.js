// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { hashPassword } from "@/lib/auth";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return new Response(
//         JSON.stringify({ error: "All fields are required" }),
//         {
//           status: 400,
//         }
//       );
//     }

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return new Response(JSON.stringify({ error: "Email already exists" }), {
//         status: 409,
//       });
//     }

//     const hashedPassword = hashPassword(password);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     return new Response(
//       JSON.stringify({ message: "User created", userId: newUser._id }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), {
//       status: 500,
//     });
//   }
// }


import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, mobile } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email, and password are required" }),
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 409,
      });
    }

    const hashedPassword = hashPassword(password);
console.log("Incoming data:", { name, email, password, mobile });
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: mobile || "", // optional, fallback to empty string
    });


    return new Response(
      JSON.stringify({ message: "User created", userId: newUser._id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

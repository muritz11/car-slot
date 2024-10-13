import { NextResponse } from "next/server";
import User from "../../../../models/UserModel";
import { connectDB } from "../../../../utils/connect";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();

    const { fullName, email, userType, password } = await req.json();
    console.log(email, fullName, userType, password);
    const exists = await User.findOne({ $or: [{ email }] });
    if (exists) {
      return NextResponse.json(
        { message: "Email already exist" },
        {
          status: 500,
        }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      fullName,
      isAdmin: userType === "admin" ? true : false,
      password: hashedPassword,
    });
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    console.log("Error while registering user", error);
    return NextResponse.json(
      {
        message: "An error occurred while registering the user.",
      },
      { status: 500 }
    );
  }
}

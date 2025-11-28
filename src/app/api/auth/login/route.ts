import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("LOGIN BODY:", body);

    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user;

    return NextResponse.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

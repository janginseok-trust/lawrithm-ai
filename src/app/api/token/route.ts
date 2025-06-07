// src/app/api/token/route.ts

import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { authOptions } from "@/lib/authOptions"; // 경로에 맞게 조정하세요
import { getServerSession } from "next-auth/next";

// GET /api/token
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json("Unauthorized: no session", { status: 401 });
    }

    const user = await getAuth().getUserByEmail(email);
    const idToken = await getAuth().createCustomToken(user.uid);

    return new NextResponse(idToken);
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json("Failed to issue token", { status: 500 });
  }
}

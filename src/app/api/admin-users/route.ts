import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verifyToken";

const ADMIN_EMAIL = "589second@gmail.com";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const token = authHeader.replace("Bearer ", "");
  let decoded = null;
  try {
    decoded = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 여기서 null 체크 추가!
  if (!decoded || decoded.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

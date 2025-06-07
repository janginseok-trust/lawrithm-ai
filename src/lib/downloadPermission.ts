import { db } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verifyToken";

export async function canDownloadDOCX(req: Request): Promise<{ allowed: boolean; reason?: string }> {
  const idToken = req.headers.get("authorization");
  const decoded = await verifyToken(idToken);

  if (!decoded?.email) return { allowed: false, reason: "unauthorized" };

  const userRef = db.collection("users").doc(decoded.email);
  const doc = await userRef.get();
  if (!doc.exists) return { allowed: false, reason: "no-record" };

  const data = doc.data();
  const plan = data?.planType;
  const remaining = data?.remainingCount;

  if (!plan) return { allowed: false, reason: "no-plan" };

  if (plan === "Unlimited") return { allowed: true };
  if (typeof remaining === "number" && remaining > 0) {
    await userRef.update({ remainingCount: remaining - 1 });
    return { allowed: true };
  }

  return { allowed: false, reason: "exceeded" };
}
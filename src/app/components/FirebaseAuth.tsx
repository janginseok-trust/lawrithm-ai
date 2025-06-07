"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SubscriptionStatus({ email }: { email: string }) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (!email) return setIsPro(false);
      const ref = doc(db, "subscriptions", email);
      const snap = await getDoc(ref);
      setIsPro(snap.exists() && snap.data().isProUser === true);
    }
    checkSubscription();
  }, [email]);

  return (
    <div>
      {isPro ? "You are a Pro member." : "You are not a member."}
    </div>
  );
}

// components/ProCheckExample.tsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ProCheckExample() {
  const { data: session } = useSession();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/check-pro", {
        method: "GET",
        headers: {
          "x-user-email": session.user.email,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsPro(!!data.isPro);
          console.log("PRO 여부:", data);
        });
    }
  }, [session]);

  return <div>PRO 여부: {isPro ? "✅ PRO" : "❌ 일반"}</div>;
}

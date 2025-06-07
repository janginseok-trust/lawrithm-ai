import { getAuth } from "firebase-admin/auth";

// undefined, null, string 모두 받는 안전한 비동기 함수
export async function verifyToken(token: string | undefined | null) {
  if (!token || !token.startsWith("Bearer ")) return null;
  try {
    return await getAuth().verifyIdToken(token.replace("Bearer ", ""));
  } catch (error) {
    return null;
  }
}

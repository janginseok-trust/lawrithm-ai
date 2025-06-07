import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 환경변수에서 서비스 계정 정보 읽기
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const adminConfig = {
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
};

const app = !getApps().length ? initializeApp(adminConfig) : getApps()[0];
export const db = getFirestore(app);

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    // 필요시 사용자 타입 확장
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

};

export const 
  handlers    // { GET, POST }
 = NextAuth(authOptions);

import { NextAuthOptions, Session, User, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./connect";

// shcema.prismaにisAdminを追加したので型を拡張してエラーが出ないように
// Session型のuserプロパティのオブジェクトにisAdminプロパティ拡張
declare module "next-auth" {
  interface Session {
    user: User & {
      isAdmin: Boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: Boolean;
  }
}

export const authOptions: NextAuthOptions = {
  // prismaの認証情報テーブル（UserやSession）に認証情報を設定したりするためのオプション
  // adapterはNextAuth.jsとデータストア（Prismaを使ったPostgreSQLデータベース）の間の通訳のような役割
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  // `isAdmin`というカスタムクレーム（プロパティ）を追加したので、
  // session関数とjwt関数を用いてisAdminプロパティを含むsession,tokenが返却されるようカスタマイズしている
  callbacks: {
    async session({ token, session }) {
      if(token) {
        session.user.isAdmin = token.isAdmin
      }
      return session;
    },
    async jwt({ token }) {
      const userInDb = await prisma.user.findUnique({
        where: {
          email: token.email!
        }
      })
      token.isAdmin = userInDb?.isAdmin!
      return token;
    },
  }
}

export const getAuthSession = (): Promise<Session | null> => getServerSession(authOptions);
import NextAuth from "next-auth/next";
import { authOptions } from "@/utils/auth";

// ハンドラーとは特定のアクションやイベントに対する反応として定義された関数
// ここではログイン、ログアウト、セッションの確認といった認証関連のリクエストを受け取る
// ハンドラーの設定は、NextAuthの設定オプション（authOptions）を使用して行う
const handler = NextAuth(authOptions);

// 作成されたハンドラーをHTTPのGETメソッドとPOSTメソッドの両方で処理するためにエクスポートしている
// これにより、Next.jsは/api/auth/*のエンドポイントに対するGETリクエストとPOSTリクエストを、
// このハンドラーを通じてNextAuthの認証システムにルーティングする
// このGET,POSTは認証関連（/api/auth/*）のリクエストに限定される
export {handler as GET, handler as POST}
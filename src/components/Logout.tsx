"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export const Logout = () => {
  return (
    <div>
      <Link href="/orders">Orders</Link>
      <span className="ml-4 cursor-pointer" onClick={() => signOut()}>Logout</span>
    </div>
  )
};
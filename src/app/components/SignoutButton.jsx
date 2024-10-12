"use client";
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return <button onClick={() => signOut({ callbackUrl: "/" })}>signout</button>;
};

export default SignoutButton;

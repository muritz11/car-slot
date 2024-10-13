"use client";
import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
  );
};

export default SignoutButton;

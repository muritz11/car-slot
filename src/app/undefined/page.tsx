"use client";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return <div></div>;
};

export default page;

"use client";
import { Flex, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import SignoutButton from "./SignoutButton";

const ComingSoon = () => {
  const pathname = usePathname();
  return (
    <Flex
      color={"root.textMuted"}
      height={"70vh"}
      justify={"center"}
      align={"center"}
      direction={"column"}
      fontSize={"20px"}
      gap={5}
      fontWeight={500}
      textTransform={"capitalize"}
    >
      <Text>
        {pathname === "/admin" || pathname === "/user"
          ? "Dashboard"
          : pathname
              ?.replace(/-|\//g, " ")
              ?.replace("admin", "")
              ?.replace("user", "")}{" "}
        Coming soon
      </Text>
      <SignoutButton />
    </Flex>
  );
};

export default ComingSoon;

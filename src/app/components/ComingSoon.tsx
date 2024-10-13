"use client";
import { Flex, Text } from "@chakra-ui/react";
import SignoutButton from "./SignoutButton";

const ComingSoon = () => {
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
    >
      <Text>Dashboard Coming soon</Text>
      <SignoutButton />
    </Flex>
  );
};

export default ComingSoon;

import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface CardProp {
  stat?: string | number | undefined;
  title: string;
  icon: IconType;
  iconColor?: string[];
  route?: string;
}

const DashCard = ({
  stat,
  title,
  icon,
  iconColor = ["#FAE6E5", "brand.primary"],
  route,
}: CardProp) => {
  const routeTo = (url: string) => {
    // if (window) {
    //   //   @ts-ignore
    //   window.location = url;
    // }
  };

  return (
    <Flex
      bg={"brand.white"}
      rounded={"10px"}
      py={"28px"}
      justify={"center"}
      align={"center"}
      gap={"13px"}
      cursor={"pointer"}
      onClick={() => (route ? routeTo(route) : "")}
    >
      <Flex
        bg={iconColor[0]}
        boxSize={"50px"}
        rounded={"50%"}
        justify="center"
        align={"center"}
      >
        <Icon as={icon} fontSize="20px" color={iconColor[1]} />
      </Flex>
      <Flex direction={"column"}>
        <Text fontSize={"22px"} fontWeight={700}>
          {stat || 0}
        </Text>
        <Text fontSize={"14px"} textTransform={"capitalize"}>
          {title}
        </Text>
      </Flex>
    </Flex>
  );
};

export default DashCard;

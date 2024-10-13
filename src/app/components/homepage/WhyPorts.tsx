"use client";
import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Image,
  Icon,
} from "@chakra-ui/react";
//@ts-ignore
// import Lottie, {useLottie} from "lottie-react";
import { FaCircleDollarToSlot, FaLocationDot } from "react-icons/fa6";
import { FaParking, FaCheckCircle } from "react-icons/fa";

export default function WhyPorts() {
  return (
    <Box className="home-section" textAlign={"center"} id={"features"}>
      <Heading className={"section-title"} pt={10}>
        Features
      </Heading>
      <Text className="section-subtitle" mt={4}>
        We offer the best all-round platform for Individual and Businesses
      </Text>

      <SimpleGrid
        minChildWidth={"250px"}
        gap={5}
        px={[3, 0]}
        mt={{ base: "30px", md: "54px" }}
        width={{ base: "full", md: "90%" }}
        mx={"auto"}
      >
        {stats.map((elem, index) => (
          <Box
            key={index + "stats"}
            rounded={"12px"}
            boxShadow={
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
            }
            p={6}
            textAlign={"left"}
          >
            <Flex
              boxSize={["45px", "60px"]}
              rounded={"12px"}
              bg={"#F2F2FF"}
              justify={"center"}
              align={"center"}
            >
              <Icon as={elem.icon} fontSize={"20px"} color={"brand.primary"} />
            </Flex>
            <Text my={[1, 4]} fontWeight={600} fontSize={["18px", "22px"]}>
              {elem.title}
            </Text>
            <Text color={"brand.textMuted"} fontSize={"14px"}>
              {elem.content}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

const stats = [
  {
    icon: FaLocationDot,
    title: "Suitable Location",
    content: <>Parking spots available near offices, malls, airports, etc.</>,
  },
  {
    icon: FaParking,
    title: "Secure Parking",
    content: (
      <>Monitored and secure parking spaces to keep your vehicle safe.</>
    ),
  },

  {
    icon: FaCheckCircle,
    title: "Easy Booking",
    content: <>Book and pay online in seconds.</>,
  },
  {
    icon: FaCircleDollarToSlot,
    title: "Affordable Rates",
    content: <>Competitive pricing to suit your budget.</>,
  },
];

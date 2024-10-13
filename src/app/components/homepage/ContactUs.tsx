"use client";
import React, { useState } from "react";
import { Box, Flex, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import { HiMail } from "react-icons/hi";
import { BsTelephoneFill } from "react-icons/bs";

export default function ContactUs() {
  return (
    <>
      <Flex
        className="home-section"
        flexDirection={"column"}
        id="contact"
        my={"150px"}
      >
        <Box textAlign={"center"}>
          <Heading className={"section-title"}>Get In Touch With Us</Heading>
          <Text className="section-subtitle" mt={4}>
            We offer the best all-round platform for Individual and Businesses
          </Text>
        </Box>

        <Flex
          width={{ base: "full", md: "2xl" }}
          mx={"auto"}
          gap={5}
          mt={10}
          mb={5}
          flexDir={{ base: "column", md: "row" }}
        >
          <Flex
            shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
            rounded={"14px"}
            p={4}
            justify={"space-between"}
            align={"center"}
            mx={"auto"}
            width={{ base: "full", md: "50%" }}
          >
            <Flex align={"center"} gap={2}>
              <Flex
                justify={"center"}
                align={"center"}
                bg={"brand.primary"}
                color={"#fff"}
                boxSize={"55px"}
                rounded={"14px"}
              >
                <Icon as={HiMail} fontSize={"30px"} />
              </Flex>
              <Text fontWeight={600} fontSize={"14px"}>
                Mail Us
              </Text>
            </Flex>
            <VStack color={"gray.400"} fontSize={"14px"} align={"flex-end"}>
              <Text>support@example.co</Text>
              <Text>info@example.co</Text>
            </VStack>
          </Flex>
          <Flex
            shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
            rounded={"14px"}
            p={4}
            justify={"space-between"}
            align={"center"}
            mx={"auto"}
            width={{ base: "full", md: "50%" }}
          >
            <Flex align={"center"} gap={2}>
              <Flex
                justify={"center"}
                align={"center"}
                bg={"#EF8354"}
                color={"#fff"}
                boxSize={"55px"}
                rounded={"14px"}
              >
                <Icon as={BsTelephoneFill} fontSize={"24px"} />
              </Flex>
              <Text fontWeight={600} fontSize={"14px"}>
                Call Us
              </Text>
            </Flex>
            <VStack color={"gray.400"} fontSize={"14px"} justify={"flex-end"}>
              <Text>+1-xxx-xxx-xxxx</Text>
              <Text>+1-xxx-xxx-xxxx</Text>
            </VStack>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

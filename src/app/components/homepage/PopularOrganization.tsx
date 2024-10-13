"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { IoOptions } from "react-icons/io5";

const PopularOrganization = ({
  title,
  variant = "categories",
}: {
  title: string;
  variant?: "categories" | "popular" | "events";
}) => {
  return (
    <>
      <Box px={{ base: 0, md: 5 }} className={"home-section"} id={"categories"}>
        {/* heading */}
        <Flex justify={"space-between"} align={"center"}>
          <Heading className={"section-title"}>{title}</Heading>
          <>
            <Button
              display={["none", "inline-flex"]}
              leftIcon={<BiCategory />}
              background={"#F2F2F2"}
              color={"#555"}
              fontWeight={400}
              textAlign={"left"}
              textTransform={"capitalize"}
              justifyContent={"flex-start"}
            >
              {"Category"}
            </Button>
            <Button
              display={["inline-flex", "none"]}
              fontWeight={600}
              variant={"ghost"}
              fontSize={"24px"}
            >
              <IoOptions />
            </Button>
          </>
        </Flex>

        {/* content */}
        <Flex flexDir={{ base: "column", md: "row" }} gap={4} mt={3}>
          <Box
            w={{ base: "25%" }}
            display={{ base: "none", md: "block" }}
            rounded={"10px"}
            shadow={
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
            }
            height={"150px"}
          >
            <Text bg={"#F2F2F2"} p={4}>
              Subcategories
            </Text>
            <Box p={4}></Box>
          </Box>
        </Flex>
        <Stack
          alignItems={"center"}
          width={"full"}
          justify={"center"}
          mt={[4, 8]}
          display={["flex", "none"]}
        >
          <Button color={"brand.primary"}>
            Explore all <Icon as={BsArrowRight} ml={5} />
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default PopularOrganization;

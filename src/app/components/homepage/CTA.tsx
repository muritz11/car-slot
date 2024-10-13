"use client";
import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const CallToAction = () => {
  return (
    <Box id="cta">
      <Flex
        bgColor={"brand.primary"}
        p={{ base: "30px", lg: "80px" }}
        minH={{ base: "350px", md: "550px", lg: "370px" }}
        px={{ base: "30px", lg: "65px" }}
        direction={"column"}
        overflowY={"hidden"}
        boxShadow={"lg"}
        rounded={"25px"}
        mt={"60px"}
        alignItems={"center"}
        justifyContent={{ base: "center" }}
        pos={"relative"}
        textAlign={{ base: "center", lg: "left" }}
      >
        <Box width={{ base: "full" }} textAlign={"center"}>
          <Text
            color={"#fff"}
            fontFamily={"lora"}
            zIndex={1}
            // lineHeight={"40px"}
            fontWeight={600}
            textTransform={"capitalize"}
            fontSize={{ base: "23px", md: "30px", lg: "50px" }}
          >
            Ready to Park with Confidence?
          </Text>
          <Text
            fontFamily={"Nunito-med, sans-serif"}
            color={"#ccc"}
            lineHeight={"30px"}
            fontSize={{ base: "14px", md: "18px" }}
            mt={4}
            // color={"brand.textMuted"}
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum
            delectus ad nihil ipsam facilis, at quisquam quasi id amet
            repudiandae voluptatem veritatis?
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default CallToAction;

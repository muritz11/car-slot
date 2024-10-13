import {
  Stack,
  Container,
  Box,
  Flex,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Avatar,
} from "@chakra-ui/react";
//@ts-ignore
// import Lottie from "lottie-react";

export default function Testimonial() {
  return (
    <Box className="home-section" id={"testimonial"}>
      <Container
        // background={"#F7F8FE"}
        maxW={"7xl"}
        // zIndex={10}
        // position={"relative"}
      >
        <Stack direction={{ base: "column", lg: "row" }}>
          <Stack flex={1} color={"#fff"} justify={{ lg: "center" }}>
            <Stack
              w={{ base: "full", md: "60%" }}
              textAlign={{ base: "center", md: "left" }}
            >
              <Heading className="section-title">
                What Our Customers Think
              </Heading>

              <Text className="section-subtitle">
                Here are what some of our customers are saying about us
              </Text>
            </Stack>

            <Flex
              // marginTop={"40px"}
              width="full"
              sx={{ columnCount: [1, 2, 3], columnGap: "8px" }}
              style={{
                marginTop: "40px",
              }}
            >
              <SimpleGrid
                gridTemplateRows="masonry"
                width="full"
                minChildWidth={"252px"}
                spacing={8}
              >
                {FeaturesStats.map((stat) => (
                  <VStack
                    borderRadius={"12px"}
                    justify="flex-start"
                    align="flex-start"
                    spacing={3}
                    shadow={
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                    }
                    bg={"#FFFFFF"}
                    key={stat.title}
                    p={5}
                  >
                    <Flex pt={3} align={"flex-start"} direction={"row"}>
                      <Box
                        boxSize={"54px"}
                        color={"white"}
                        rounded={"full"}
                        bg={"gray.100"}
                        mb={1}
                      >
                        <Avatar
                          width={"full"}
                          height={"full"}
                          objectFit={"cover"}
                          borderRadius={"full"}
                          src={""}
                        />
                      </Box>
                      <Flex
                        px={4}
                        align={"flex-start"}
                        justifyItems={"center"}
                        direction={"column"}
                      >
                        <Text
                          fontFamily={"Nunito-Bold, sans-serif"}
                          fontSize={"md"}
                          fontWeight={"extrabold"}
                          color={"#000"}
                        >
                          {stat.customerName}
                        </Text>
                        <Text
                          fontFamily={"Nunito-regular, sans-serif"}
                          fontSize={"sm"}
                          color={"#aaa"}
                        >
                          {stat.company}
                        </Text>
                      </Flex>
                    </Flex>

                    <Box>
                      <Text
                        fontFamily={"Nunito-med, sans-serif"}
                        fontSize={{ base: "md", md: "sm" }}
                        lineHeight={"24px"}
                        fontWeight={500}
                        color={"#aaa"}
                      >
                        {stat.content}
                      </Text>
                    </Box>
                  </VStack>
                ))}
              </SimpleGrid>
            </Flex>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

const FeaturesStats = [
  {
    color: "#325CE8",
    bg: "#F2F4FE",
    title: "Main Savings",
    customerName: "John Doe",
    company: "Consultant Doctor",
    content: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim quae,
        numquam iusto perspiciatis blanditiis pariatur dolorum odio, ducimus
        obcaecati.
      </>
    ),
  },
  {
    color: "#325CE8",
    bg: "#F2F4FE",
    title: "Main Saving",
    customerName: "John Doe",
    company: "Consultant Doctor",
    content: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim quae,
        numquam iusto perspiciatis blanditiis pariatur dolorum odio, ducimus
        obcaecati.
      </>
    ),
  },
  {
    color: "#325CE8",
    bg: "#F2F4FE",
    title: "Main Savin",
    customerName: "John Doe",
    company: "Consultant Doctor",
    content: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim quae,
        numquam iusto perspiciatis blanditiis pariatur dolorum odio, ducimus
        obcaecati.
      </>
    ),
  },
];

"use client";
import { ReactNode } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  VisuallyHidden,
  chakra,
} from "@chakra-ui/react";
import Logo from "../../assets/images/img.jpg";
import { Link } from "@chakra-ui/next-js";

import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={"whiteAlpha.100"}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      target={"_blank"}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      fontSize={"18px"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: "brand.primaryTintX",
        color: "brand.primary",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function MyFooter() {
  const date = new Date();

  return (
    <Box bg={"#000"} color={"gray.200"}>
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        pt={8}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Box>
          <Image
            src={"/logo.jpg"}
            width={"60px"}
            objectFit={"contain"}
            alt="logo"
          />
        </Box>
        <Stack direction={"row"} spacing={6}>
          <Link href={"/#"}>Terms of Use</Link>
          <Link href={`/#testimonial`} _hover={{ textDecoration: "underline" }}>
            Testimonials
          </Link>
          <Link href={"/#"}>FAQ</Link>
          <Link href={"/#"}>Events</Link>
        </Stack>
      </Container>

      <Box>
        <Container
          as={Stack}
          maxW={"6xl"}
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={"gray.700"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Stack direction={"row"} spacing={6}>
            <SocialButton label={"Instagram"} href={"#"}>
              <FaInstagram />
            </SocialButton>
            <SocialButton label={"Twitter"} href={"#"}>
              <FaTwitter />
            </SocialButton>

            <SocialButton label={"Facebook"} href={"#"}>
              <FaFacebook />
            </SocialButton>
          </Stack>
          <Text>© {date.getFullYear()} Carslot. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  );
}

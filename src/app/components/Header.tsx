"use client";
import {
  Image,
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Popover,
  PopoverTrigger,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { HiMenuAlt3 } from "react-icons/hi";
import { useSession } from "next-auth/react";

export default function Header({ isPurple = false }: { isPurple?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();

  return (
    <>
      <Box
        position={isPurple ? "static" : "fixed"}
        zIndex={1200}
        w={"100%"}
        maxW={"1440px"}
        mx={"auto"}
      >
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          autoFocus={false}
          size={["xs", "sm"]}
        >
          <DrawerOverlay />
          <DrawerContent>
            <Flex
              bg={"#fff"}
              flexDirection={"row"}
              height={"100px"}
              px={5}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Flex justify="center" align="center">
                <Link href="/">
                  <Image
                    objectFit="contain"
                    src={"/logo.jpg"}
                    width={"60px"}
                    alt="Logo"
                  />
                </Link>
              </Flex>

              <Flex bg={"red"} justifyContent="center" alignItems="center">
                <DrawerCloseButton py={10} />
              </Flex>
            </Flex>

            <DrawerBody flex={1} bg={"#FDFBFE"}>
              <VStack spacing={6} alignItems={"flex-start"}>
                {NAV_ITEMS.map((navItem) => (
                  <Box
                    key={navItem.label}
                    minW={100}
                    alignItems={"flex-start"}
                    textAlign={"left"}
                  >
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                      <PopoverTrigger>
                        {navItem.href.includes("/") ? (
                          <Link href={`${navItem.href}`}>
                            <Text
                              cursor={"pointer"}
                              fontFamily={"Nunito-regular"}
                              fontWeight={600}
                            >
                              {navItem.label}
                            </Text>
                          </Link>
                        ) : (
                          <Link href={`/#${navItem.href}`}>
                            <Text
                              onClick={onClose}
                              cursor={"pointer"}
                              fontFamily={"Nunito-regular"}
                              fontWeight={600}
                            >
                              {navItem.label}
                            </Text>
                          </Link>
                        )}
                      </PopoverTrigger>
                    </Popover>
                  </Box>
                ))}
              </VStack>

              <Flex gap={2} mt={4}>
                {status === "loading" ? (
                  <Box></Box>
                ) : (
                  <>
                    {!session?.user ? (
                      <>
                        <Button
                          as={Link}
                          href="/login"
                          variant={"outline"}
                          width={"110px"}
                          fontWeight={400}
                          border={"1px"}
                          borderColor={"brand.primary"}
                          color={"brand.primary"}
                          _hover={{
                            bg: "brand.primaryTint",
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          as={Link}
                          href="/register"
                          width={"110px"}
                          fontWeight={400}
                          color={"white"}
                          bg={"brand.primary"}
                          _hover={{
                            bg: "brand.primary",
                          }}
                        >
                          Sign up
                        </Button>
                      </>
                    ) : (
                      <Button
                        as={Link}
                        // @ts-ignore
                        href={`/${session?.user?.role}`}
                        fontWeight={400}
                        color={"white"}
                        bg={"brand.primary"}
                        _hover={{
                          bg: "brand.primary",
                        }}
                      >
                        My Dashboard
                      </Button>
                    )}
                  </>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Flex
          backgroundColor={isPurple ? "transparent" : "#fff"}
          //   className={styles.header}
          py={{ base: 2 }}
          px={{ base: 5, md: 20 }}
          justify={"space-between"}
          align={"center"}
          height={"70px"}
        >
          {/* desktop nav items */}
          <Flex justify={{ base: "center", md: "start" }}>
            <Flex
              style={{ height: "100%" }}
              my={3}
              justify="center"
              align="center"
            >
              <Link href="/">
                <Image
                  style={{
                    maxWidth: "100px",
                  }}
                  objectFit="contain"
                  //   @ts-ignore
                  src={"/logo.jpg"}
                  width={"60px"}
                  alt="Logo"
                />
              </Link>
            </Flex>
          </Flex>

          <Flex
            flex={{ base: 1 }}
            justify={"center"}
            display={{ base: "none", lg: "flex" }}
          >
            <DesktopNav />
          </Flex>

          <Flex gap={2} display={{ base: "none", lg: "flex" }}>
            {status === "loading" ? (
              <Box></Box>
            ) : (
              <>
                {!session?.user ? (
                  <>
                    <Button
                      as={Link}
                      href="/login"
                      variant={"outline"}
                      width={"110px"}
                      fontWeight={400}
                      border={"1px"}
                      borderColor={isPurple ? "#fff" : "brand.primary"}
                      color={isPurple ? "#fff" : "brand.primary"}
                      _hover={{
                        bg: isPurple ? "" : "brand.primaryTint",
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      as={Link}
                      href="/register"
                      width={"110px"}
                      fontWeight={400}
                      color={isPurple ? "brand.primary" : "white"}
                      bg={isPurple ? "#fff" : "brand.primary"}
                      _hover={{
                        bg: isPurple ? "#e8e8e8" : "brand.primary",
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <Button
                    as={Link}
                    // @ts-ignore
                    href={`/${session?.user?.role}`}
                    width={"110px"}
                    fontWeight={400}
                    color={isPurple ? "brand.primary" : "white"}
                    bg={isPurple ? "#fff" : "brand.primary"}
                    _hover={{
                      bg: isPurple ? "#e8e8e8" : "brand.primary",
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </>
            )}
          </Flex>
          {/* end desktop nav items */}

          {/* menu btn */}
          <Flex
            flex={{ base: 1 }}
            alignItems={"flex-end"}
            justifyContent={{ base: "flex-end", md: "flex-end" }}
            display={{ base: "flex", lg: "none" }}
          >
            <HiMenuAlt3
              onClick={onOpen}
              color={isPurple ? "#fff" : "#000"}
              size={30}
            />
          </Flex>
          {/* end menu btn */}
        </Flex>
      </Box>
      <Box
        width={"100%"}
        height={{ base: "150px", md: "80px" }}
        display={{ base: "none", md: "block" }}
      ></Box>
    </>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={"row"} gap={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label} alignItems={"center"} textAlign={"center"}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              {navItem.href.includes("/") ? (
                <Link href={`${navItem.href}`}>
                  <Text
                    cursor={"pointer"}
                    fontFamily={"Nunito-regular"}
                    fontWeight={400}
                  >
                    {navItem.label}
                  </Text>
                </Link>
              ) : (
                <Link href={`/#${navItem.href}`}>
                  <Text
                    cursor={"pointer"}
                    fontFamily={"Nunito-regular"}
                    fontWeight={400}
                  >
                    {navItem.label}
                  </Text>
                </Link>
              )}
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}

      <Link href={"/faq"} style={{ display: "none" }}>
        <Text cursor={"pointer"} fontFamily={"Nunito-regular"} fontWeight={400}>
          FAQ
        </Text>
      </Link>
      <Link href={"/our-events"} style={{ display: "none" }}>
        <Text cursor={"pointer"} fontFamily={"Nunito-regular"} fontWeight={400}>
          Events
        </Text>
      </Link>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "home",
  },
  {
    label: "Features",
    href: "features",
  },
  {
    label: "How it Works",
    href: "hiw",
  },
  {
    label: "Contact",
    href: "contact",
  },
];

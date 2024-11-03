"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Text,
  Collapse,
} from "@chakra-ui/react";
import { RiDeleteBin4Line, RiLayoutMasonryFill } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { IconType } from "react-icons";
import { ReactText } from "react";
import MobileNav from "./TopNav";
import { FaChevronDown, FaRegStar } from "react-icons/fa6";
import { signOut, useSession } from "next-auth/react";
import { Link } from "@chakra-ui/next-js";
import { usePathname } from "next/navigation";
import { MdPlaylistAdd } from "react-icons/md";
import { BsBookmarkPlus } from "react-icons/bs";
import { IoBookOutline } from "react-icons/io5";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { LuLayoutList } from "react-icons/lu";
// import { RootState } from '../../redux/store';

interface LinkItemProps {
  name: string;
  icon: IconType;
  routeTo?: string;
  isCollapsible?: boolean;
  linkItems?: LinkItemProps[];
}

export function SideBar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        className={"sidebarI vScroll"}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="sm"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} className={"sidebarII vScroll"} />
        </DrawerContent>
      </Drawer>

      {/* top nav */}
      <MobileNav onOpen={onOpen} />

      {/* dashboard content */}
      <Box ml={{ base: 0, md: 60 }} pt={0} p={["15px", "32px", "20px"]}>
        <Box mx={"auto"} maxWidth={"1400px"}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

/*******************
 * Main sidebar
 * *****************/
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const [linkItems, setLinkItems] = useState<LinkItemProps[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    //   @ts-ignore
    if (session?.user?.role === "admin") {
      setLinkItems([
        {
          name: "Dashboard",
          icon: RiLayoutMasonryFill,
          routeTo: "/admin",
        },
        {
          name: "Manage area",
          icon: PiMapPinAreaDuotone,
          routeTo: "/admin/manage-area",
        },
        {
          name: "Manage slots",
          icon: LuLayoutList,
          routeTo: "/admin/manage-slots",
        },
        {
          name: "Bookings",
          icon: IoBookOutline,
          routeTo: "/admin/bookings",
        },
      ]);
    }

    //   @ts-ignore
    if (session?.user?.role === "user") {
      setLinkItems([
        {
          name: "Dashboard",
          icon: RiLayoutMasonryFill,
          routeTo: "/user",
        },
        {
          name: "Reserve a slot",
          icon: BsBookmarkPlus,
          routeTo: "/user/reserve-slot",
        },
        {
          name: "My bookings",
          icon: IoBookOutline,
          routeTo: "/user/my-bookings",
        },
      ]);
    }
  }, [session]);

  return (
    <Box
      transition="3s ease"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      overflowY={"auto"}
      bg={"brand.white"}
      {...rest}
    >
      <Flex justify={"flex-end"} padding={3}>
        <CloseButton
          color={"brand.dangerDark"}
          display={{ base: "flex", md: "none" }}
          fontSize={"18px"}
          onClick={onClose}
        />
      </Flex>
      <Flex
        h="5rem"
        alignItems="center"
        mx="8"
        mt={{ base: "20px", md: "47px" }}
        mb={"54px"}
        justifyContent="center"
        direction={"column"}
        gap={2}
      >
        <Image src={"/logo.jpg"} width={"100px"} alt="logo" />
        <Text
          textTransform={"capitalize"}
          textAlign={"center"}
          color={"brand.textMuted"}
          fontWeight={500}
        >
          {/* @ts-ignore */}
          {session?.user?.role}
        </Text>
      </Flex>
      {linkItems.map((link) =>
        link.isCollapsible ? (
          <CollapsibleNavItem
            key={link.name}
            onClick={onClose}
            icon={link.icon}
            items={link.linkItems}
          >
            {link.name}
          </CollapsibleNavItem>
        ) : (
          <NavItem
            key={link.name}
            onClick={onClose}
            routeTo={link.routeTo || ""}
            icon={link.icon}
          >
            {link.name}
          </NavItem>
        )
      )}

      <Flex
        align="center"
        p="3"
        pl={"8"}
        my="5"
        mt={"50px"}
        transition={"0.2s ease"}
        role="group"
        cursor="pointer"
        className="sideLink"
        color={"#16000066"}
        onClick={() => signOut({ callbackUrl: "/" })}
        _hover={{ color: "brand.black", borderRight: "3px solid" }}
      >
        <Icon
          mr="4"
          fontSize="24"
          _groupHover={{
            color: "brand.primaryII",
          }}
          as={AiOutlineLogout}
        />
        Logout
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  routeTo?: string;
  items?: LinkItemProps[];
  mini?: boolean;
  children: ReactText;
}
const NavItem = ({ icon, routeTo, children, mini, ...rest }: NavItemProps) => {
  const pathname = usePathname();

  return (
    <Link href={routeTo || ""}>
      <Flex
        align="center"
        p={1}
        pl={mini ? "45px" : "8"}
        my={mini ? 2 : 5}
        transition={"0.2s ease"}
        role="group"
        cursor="pointer"
        color={pathname === routeTo ? "brand.primary" : "#16000066"}
        borderRight={pathname === routeTo ? "3px solid" : "none"}
        textDecoration={"none"}
        borderColor={"brand.primary"}
        _hover={{
          color: "brand.black",
          borderRight: "3px solid",
          textDecoration: "none",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize={mini ? "20" : "24"}
            _groupHover={{
              color: "brand.primaryII",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const CollapsibleNavItem = ({
  icon,
  children,
  items,
  onClick,
  ...rest
}: NavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Flex
        justify={"space-between"}
        p={1}
        pl={"8"}
        pr={3}
        mt="5"
        mb={isOpen ? 0 : 5}
        transition={"0.2s ease"}
        cursor="pointer"
        className="sideLink"
        color={"#16000066"}
        _hover={{
          color: "brand.primary",
        }}
        onClick={onToggle}
        {...rest}
      >
        <Flex align="center">
          {icon && (
            <Icon
              mr="4"
              fontSize="24"
              _groupHover={{
                color: "brand.primaryII",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
        <Icon
          as={FaChevronDown}
          className={isOpen ? "rotate-arrow" : "reverse-rotate-arrow"}
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {items?.map((val) => (
          <NavItem
            key={val.name}
            onClick={onClick}
            routeTo={val.routeTo || ""}
            icon={val.icon}
            mini={true}
          >
            {val.name}
          </NavItem>
        ))}
      </Collapse>
    </>
  );
};

export default SideBar;

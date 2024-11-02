import {
  FlexProps,
  Flex,
  Heading,
  IconButton,
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { Link } from "@chakra-ui/next-js";
import { usePathname } from "next/navigation";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={["15px", "32px"]}
      height="20"
      alignItems="center"
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      {/* left */}
      <Flex align={"center"}>
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          rounded={"8px"}
          size={"sm"}
          mr={2}
          icon={<FiMenu />}
        />
        <Heading
          fontWeight={700}
          fontSize={["20px", "26px"]}
          textTransform={"capitalize"}
        >
          {pathname === "/admin" || pathname === "/user"
            ? "Dashboard"
            : pathname
                ?.split("/")
                .filter((segment) => !/^[a-f\d]{24}$/i.test(segment)) // Exclude ObjectId-like segments
                .join(" ")
                ?.replace(/-|\//g, " ")
                ?.replace("admin", "")
                ?.replace("user", "")}
        </Heading>
      </Flex>

      {/* right side */}
      <Flex gap={"16px"} align={"center"}>
        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: "none" }}
          >
            <HStack>
              <HStack>
                <Avatar size={"sm"} src={session?.user?.image || ""} />
                <Box>
                  <FiChevronDown />
                </Box>
              </HStack>
            </HStack>
          </MenuButton>
          <MenuList color={"root.black"}>
            <Text
              px={3}
              fontWeight={600}
              pt={2}
              fontSize={"14px"}
              textTransform={"capitalize"}
            >
              {session?.user?.name}
            </Text>
            <Text
              px={3}
              fontWeight={500}
              py={2}
              pt={0}
              fontSize={"12px"}
              color={"root.textMuted"}
            >
              {session?.user?.email}
            </Text>
            {/* @ts-ignore */}
            <Link href={`/${session?.user?.role}/settings`}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default MobileNav;

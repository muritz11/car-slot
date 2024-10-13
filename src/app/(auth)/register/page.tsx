"use client";
import { Flex, Box, Heading, Button, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "../../assets/images/img.jpg";
import CustomInput from "../../../../utils/CustomInput";
import { showError, showSuccess } from "../../../../utils/Alerts";
import CustomMenu, { MenuItemsObj } from "../../../../utils/CustomMenu";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userTypeItemsArr] = useState<MenuItemsObj[]>([
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ]);
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });

  const handleInputs = (e: any) => {
    const { value, name } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formState.email || !formState.fullName || !formState.password) {
      showError("All fields are required");
      return;
    }

    if (!formState.userType) {
      showError("Select user type");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        showSuccess("user registered");
        router.push("/login");
      } else {
        const err = await res.json();
        showError(`${err.message}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showError("Something went wrong");
    }
  };

  return (
    <Flex justify={"center"} align={"center"} minH={"100vh"}>
      <Box width={{ base: "90%", md: "550px" }} py={"50px"} mt={"40px"}>
        <Flex
          position={"absolute"}
          top={"15px"}
          left={["10px", "40px"]}
          align={"center"}
        >
          <Image
            objectFit="contain"
            src={"/logo.jpg"}
            width={"60px"}
            alt="Logo"
          />
        </Flex>
        <Box my="32px">
          <Heading
            as={"h2"}
            fontSize="24px"
            fontWeight={700}
            textAlign={"center"}
          >
            Sign up
          </Heading>
          <Text textAlign={"center"} mt={"8px"}>
            {"Enter your info below to signup"}
          </Text>
        </Box>

        {/* main */}
        <form onSubmit={handleSubmit}>
          <CustomInput
            label="Your name"
            name="fullName"
            type="text"
            value={formState.fullName}
            onChange={handleInputs}
            mb="13px"
          />
          <CustomInput
            label="Your email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleInputs}
            mb="13px"
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleInputs}
            mb="13px"
          />
          <Box>
            <Text fontWeight={500} mb={2}>
              User type
            </Text>
            <CustomMenu
              value={formState.userType}
              items={userTypeItemsArr}
              placeholder="Select user type"
              setValue={(val) => {
                setFormState({ ...formState, userType: val });
              }}
            />
          </Box>
          <Button
            type="submit"
            variant={"primary"}
            mt={"29px"}
            w={"full"}
            height={"48px"}
            fontWeight={500}
            isLoading={isLoading}
            rounded="8px"
          >
            Sign up
          </Button>
          <Button
            variant={"ghost"}
            as={Link}
            href={"/login"}
            w={"full"}
            fontWeight={500}
            _hover={{ bg: "transparent" }}
          >
            Already have an account? Sign in
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;

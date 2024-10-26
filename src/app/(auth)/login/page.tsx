"use client";
import { Flex, Box, Heading, Image, Text, Button } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import CustomInput from "../../../../utils/CustomInput";
import { showError, showSuccess } from "../../../../utils/Alerts";

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (session?.user) {
      // @ts-ignore
      router.replace(`/${session?.user?.role}`);
    }
  }, [session]);

  const handleInputs = (e: any) => {
    const { value, name } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { email, password } = formState;

    if (!email || !password) {
      showError("All fields are required");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setIsLoading(false);
        console.log(res);
        showError("Invalid credentials");
        return;
      }

      const sessionCheck = await fetch("api/auth/session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const session = await sessionCheck.json();

      // console.log("first", res);
      showSuccess("Login successful. Redirect...");
      setIsLoading(false);
      router.replace(`/${session?.user?.role}`);
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
            Login
          </Heading>
          <Text textAlign={"center"} mt={"8px"}>
            {"Enter your info below to login"}
          </Text>
        </Box>

        {/* main */}
        <form onSubmit={handleSubmit}>
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
            Sign in
          </Button>
          <Button
            variant={"ghost"}
            as={Link}
            href={"/register"}
            w={"full"}
            fontWeight={500}
            _hover={{ bg: "transparent" }}
          >
            Don't have an account? Sign up
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;

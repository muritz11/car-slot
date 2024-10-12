"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleInputs = (e: any) => {
    const { value, name } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { email, password } = formState;

    if (!email && !password) {
      alert("Empty input fields!!");
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
        alert("Invalid credentials");
        return;
      }

      setIsLoading(false);
      router.replace("/admin");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          onChange={handleInputs}
        />
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={handleInputs}
        />
        <button>{isLoading ? "Loading..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default Login;

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputs = (e: any) => {
    const { value, name } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formState.email && !formState.fullName && !formState.password) {
      alert("Empty input fields!!");
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
        alert("user registered");
        router.push("/login");
      } else {
        const err = await res.json();
        alert(`Something went wrong: ${err.message}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Enter Name"
          name="fullName"
          onChange={handleInputs}
        />
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

export default Register;

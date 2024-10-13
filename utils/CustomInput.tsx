"use client";
import React, { ReactNode, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormControlProps,
  Icon,
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface CustomInputProps extends FormControlProps {
  label?: string;
  type?: string;
  value: string | number;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  greyInput?: boolean;
  inputRightElement?: ReactNode;
  inputLeftElement?: ReactNode;
  onChange: (e: any) => void;
}

const CustomInput = ({
  label,
  type = "text",
  value,
  name,
  onChange,
  placeholder = "",
  readOnly = false,
  greyInput,
  inputRightElement,
  inputLeftElement,
  ...rest
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordType = showPassword ? "text" : "password";

  return (
    <FormControl {...rest}>
      {label ? (
        <FormLabel fontWeight={500} color={"#48494D"}>
          {label}
        </FormLabel>
      ) : (
        ""
      )}
      <InputGroup
        rounded={"8px"}
        px={"16px"}
        height={"48px"}
        border={greyInput ? "none" : "1px"}
        borderColor={"#D3D4DA"}
        bg={greyInput ? "#F7F7F8" : "transparent"}
        alignItems={"center"}
      >
        {inputLeftElement ? (
          <InputLeftElement height={"inherit"}>
            {inputLeftElement}
          </InputLeftElement>
        ) : (
          ""
        )}
        <Input
          type={type === "password" ? passwordType : type}
          px={0}
          border={"none"}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          _focusVisible={{ border: "none" }}
        />
        {type === "password" ? (
          <InputRightElement height={"inherit"}>
            <Icon
              as={showPassword ? FiEyeOff : FiEye}
              onClick={() => setShowPassword(!showPassword)}
              cursor="pointer"
            />
          </InputRightElement>
        ) : (
          ""
        )}
        {inputRightElement ? (
          <InputRightElement top={1}>{inputRightElement}</InputRightElement>
        ) : (
          ""
        )}
      </InputGroup>
    </FormControl>
  );
};

export default CustomInput;

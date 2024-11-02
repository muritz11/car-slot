import {
  FormControl,
  FormLabel,
  Input,
  FormControlProps,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { PiCalendarDotsFill } from "react-icons/pi";
import DatePicker from "react-datepicker";
import { useRef } from "react";

interface CustomInputProps extends FormControlProps {
  label?: string;
  type?: string;
  value: Date | null;
  placeholder?: string;
  readOnly?: boolean;
  greyInput?: boolean;
  onChange: (e: any) => void;
  startToday?: boolean;
  portalId?: undefined | string;
}

const CustomDateTimePicker = ({
  label,
  value,
  onChange,
  placeholder = "",
  readOnly = false,
  greyInput,
  startToday = true,
  portalId,
  ...rest
}: CustomInputProps) => {
  const inputRef: { current: any } | null = useRef(null);

  const clickInput = () => {
    if (inputRef.current && inputRef.current.setFocus) {
      inputRef.current.setFocus();
    }
  };

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
        bg={greyInput ? "#F7F7F8" : "transparent"}
        border={"1px solid"}
        borderColor={"#D3D4DA"}
        alignItems={"center"}
      >
        <Input
          as={DatePicker}
          px={0}
          border={"none"}
          ref={inputRef}
          selected={value}
          onChange={onChange}
          showTimeSelect={true}
          timeFormat="HH:mm"
          timeCaption="Time"
          dateFormat={"dd/MM/yyyy h:mm aa"}
          placeholder={placeholder}
          minDate={startToday ? new Date() : undefined}
          portalId={portalId || "c_popper"}
          readOnly={readOnly}
          _focusVisible={{ border: "none" }}
          autoComplete={"off"}
        />
        <InputRightElement top={1} onClick={clickInput}>
          <Icon
            as={PiCalendarDotsFill}
            color={"root.primary"}
            fontSize={"22px"}
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default CustomDateTimePicker;

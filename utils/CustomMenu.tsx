import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaChevronDown } from "react-icons/fa6";

export interface MenuItemsObj {
  label: string;
  value?: string;
}

interface ElemProp {
  value: string;
  placeholder?: string;
  setValue: (val: string) => void;
  mb?: string | number;
  items: MenuItemsObj[];
  mini?: boolean;
  isLazy?: boolean;
  btnVariant?: string;
  textAlign?: "left" | "center" | "right";
}

const CustomMenu = ({
  value,
  items,
  placeholder,
  setValue,
  mini = false,
  isLazy = false,
  btnVariant = "solid",
  textAlign,
  mb,
}: ElemProp) => {
  const [menuValue, setMenuValue] = useState("");

  useEffect(() => {
    let selected: MenuItemsObj[];
    selected = items.filter((val) => val?.value === value);
    if (!selected.length) {
      selected = items.filter((val) => val.label === value);
    }

    setMenuValue(selected[0]?.label);
  }, [items, value]);

  return (
    <Menu matchWidth={!mini} isLazy={isLazy}>
      {mini ? (
        <MenuButton
          as={Button}
          variant={btnVariant}
          rightIcon={<FaChevronDown />}
          size={"sm"}
          overflow={"hidden"}
          fontWeight={400}
          textAlign={textAlign || "center"}
        >
          {menuValue || placeholder}
        </MenuButton>
      ) : (
        <MenuButton
          as={Button}
          width={"100%"}
          textAlign={textAlign || "left"}
          bg={"#F7F7F8"}
          mb={mb}
          height={"48px"}
          overflow={"hidden"}
          rightIcon={
            <Icon
              as={TiArrowSortedDown}
              color={"root.primary"}
              fontSize={"24px"}
            />
          }
          fontWeight={400}
        >
          {menuValue || placeholder}
        </MenuButton>
      )}
      <MenuList color={"root.black"} maxH={"300px"} overflowY={"auto"}>
        {/* <MenuItem>{placeholder}</MenuItem> */}
        {items.map((item, idx) => (
          <MenuItem
            key={`${item.label}-${idx}`}
            background={item.value === value ? "blue.100" : "transparent"}
            onClick={() => setValue(item.value || item.label)}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CustomMenu;

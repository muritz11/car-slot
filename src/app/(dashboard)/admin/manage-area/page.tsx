"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { HiOutlineCamera } from "react-icons/hi";
import CustomInput from "../../../../../utils/CustomInput";
import { useEffect, useRef, useState } from "react";
import { showError, showSuccess } from "../../../../../utils/Alerts";
import { truncateText } from "../../../../../utils/helpers";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import Loader from "../../../../../utils/Loader";
import CustomPrompt from "../../../../../utils/CustomPrompt";

export interface IArea {
  _id: string;
  title: string;
  location: string;
  coverUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ManageSlot = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [menuEditId, setMenuEditId] = useState<undefined | string>(undefined);
  const fileElement: { current: any } | null = useRef(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [fetchedAreas, setFetchedAreas] = useState<IArea[]>([]);
  const {
    isOpen: isDelPromptOpen,
    onOpen: onDelPromptOpen,
    onClose: onDelPromptClose,
  } = useDisclosure();
  const [formState, setFormState] = useState({
    title: "",
    location: "",
  });

  const fetchAreas = async () => {
    setIsFetchLoading(true);
    const fetchItems = await fetch("/api/area", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    if (res?.success) {
      setFetchedAreas(res?.data);
    } else {
      showError(res?.message || "An error occurred, could not fetch areas");
    }
    setIsFetchLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleInputs = (e: any) => {
    const { value, name } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let images = e.target.files;

    const allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
    if (!allowedExtensions.exec(e.target.value)) {
      showError("Invalid file type");
      return false;
    }

    const TwoMB = 2000000;
    if (images?.length) {
      if (images[0].size >= TwoMB) {
        showError("File must be less than 2MB");
        return;
      } else {
        setFile(images[0]);
        const reader = new FileReader();
        reader.readAsDataURL(images[0]);
      }
    }
  };

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const clickFileElem = () => {
    if (fileElement.current) {
      fileElement.current.click();
    }
  };

  const selectMenu = (menuId: string) => {
    setMenuEditId(menuId);
    const selectedArea = fetchedAreas?.find((value) => value?._id === menuId);
    setFormState({
      ...formState,
      title: selectedArea?.title || "",
      location: selectedArea?.location || "",
    });
    setPreview(selectedArea?.coverUrl);
  };

  const resetFormState = () => {
    setFormState({
      title: "",
      location: "",
    });
  };

  const resetMenuForm = () => {
    setMenuEditId(undefined);
    resetFormState();
  };

  const deleteItem = async () => {
    setIsDeleteLoading(true);
    const deleteItem = await fetch(`/api/area`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ areaId: menuEditId }),
    });

    const res = await deleteItem.json();
    if (res?.success) {
      showSuccess("Area deleted successfully");
      fetchAreas();
      onDelPromptClose();
    } else {
      showError(res?.message || "An error occurred, please try again later");
    }
    setIsDeleteLoading(false);
  };

  const handleSubmit = async () => {
    const { location, title } = formState;

    if (!title || !location) {
      showError("title and area fields are required");
      return;
    }

    if (!menuEditId) {
      try {
        setisLoading(true);

        // TODO: try uploading the img the return coverUrl
        const res = await fetch("/api/area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formState }),
        });

        if (res.ok) {
          resetFormState();
          showSuccess("Area created successfully");
          fetchAreas();
        } else {
          const err = await res.json();
          showError(`${err.message}`);
        }
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
        console.log(error);
        showError("Something went wrong");
      }
    } else {
      try {
        setisLoading(true);

        const res = await fetch("/api/area", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formState, areaId: menuEditId }),
        });

        if (res.ok) {
          resetFormState();
          showSuccess("Area updated successfully");
          fetchAreas();
        } else {
          const err = await res.json();
          showError(`${err.message}`);
        }
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
        console.log(error);
        showError("Something went wrong");
      }
    }
  };

  return (
    <>
      <Flex gap={3} flexDir={{ base: "column", md: "row" }}>
        {/* menu */}
        <Box
          width={{ base: "full", md: "65%" }}
          bg={"#fff"}
          borderRadius={"16px"}
          p={"23px"}
          height={"650px"}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"} mb={7}>
            <Heading
              fontSize={"20px"}
              color={"#666"}
              fontWeight={700}
              width={"20%"}
            >
              Areas
            </Heading>
            {/* <Flex
              gap={{ base: 1, md: 2 }}
              width={"80%"}
              justifyContent={"flex-end"}
            >
              <InputGroup width={{ base: "100px", md: "150px", lg: "300px" }}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<FiSearch color="#4D4D4D" />}
                />
                <Input
                  placeholder="Search by customer name or order ID"
                  type={"search"}
                  fontSize={"12px"}
                  variant={"filled"}
                  bg={"#F2F1F1"}
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius={"8px"}
                />
              </InputGroup>

              <Button
                rightIcon={<LuSettings2 />}
                variant={"outline"}
                borderRadius={"8px"}
                borderColor={"brand.primary"}
                color={"brand.primary"}
                fontWeight={500}
                px={5}
              >
                Filter
              </Button>
            </Flex> */}
          </Flex>

          <Box height={"550px"} overflowY={"auto"} className={"custom-scroll"}>
            <Flex justify={"flex-start"} flexWrap={"wrap"} gap={"10px"}>
              {/* todo: simulate empty menu */}
              <Loader isLoading={isFetchLoading} height={"300px"} />
              {fetchedAreas?.map((menu) => (
                <MenuCard
                  key={menu?._id}
                  name={menu?.title}
                  onClick={() => selectMenu(menu?._id)}
                  location={menu.location}
                  imgSrc={menu.coverUrl || ""}
                />
              ))}
            </Flex>
          </Box>
        </Box>
        {/* menu detail */}
        <Box
          width={{ base: "full", md: "35%" }}
          transition={"height 0.3s ease-out"}
          // height={"400px"}
          bg={"#fff"}
          borderRadius={"16px"}
          px={"16px"}
          py={"23px"}
        >
          <Flex justify={"space-between"} align={"center"} mb={"15px"}>
            <Box>
              <Text color={"#666"} fontWeight={600} fontSize={"14px"}>
                {menuEditId ? "Area details" : "Add an area"}
              </Text>
            </Box>
            <Box textAlign={"right"}>
              {menuEditId ? (
                <Button
                  leftIcon={<FiPlus />}
                  fontSize={"14px"}
                  size={"sm"}
                  fontWeight={400}
                  bg={"brand.primary"}
                  color={"#fff"}
                  onClick={resetMenuForm}
                  _hover={{ bg: "brand.primary" }}
                >
                  Add an area
                </Button>
              ) : (
                ""
              )}
            </Box>
          </Flex>
          {/* <Loader
            isLoading={simulateIsEditLoading}
          /> */}
          <Box mb={"40px"} display={"block"}>
            {/* Menu detail form */}
            <Flex
              borderRadius="50%"
              justify={"center"}
              align={"center"}
              boxSize={"80px"}
              onClick={clickFileElem}
              position={"relative"}
              cursor={"pointer"}
            >
              <Avatar
                src={preview || ""}
                boxSize={"100%"}
                name={" "}
                background={"#D9D9D9"}
                objectFit={"cover"}
              />
              <Flex
                bottom={0}
                right={0}
                position={"absolute"}
                bg={"brand.primary"}
                rounded={"50%"}
                boxSize={"25px"}
                justify={"center"}
                align={"center"}
              >
                <HiOutlineCamera color={"#fff"} fontSize="16px" />
              </Flex>
            </Flex>
            <input
              type="file"
              ref={fileElement}
              accept="image/*"
              name="pic"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <Box mt={5}>
              <CustomInput
                onChange={handleInputs}
                name={"title"}
                bg={"#F9F7F4"}
                border={"none"}
                placeholder={"Area title"}
                value={formState.title}
                title={"Area title"}
              />
            </Box>
            <Box mt={5}>
              <CustomInput
                onChange={handleInputs}
                name={"location"}
                bg={"#F9F7F4"}
                border={"none"}
                placeholder={"Location"}
                value={formState.location}
                title={"Location"}
              />
            </Box>
          </Box>
          <Button
            size={"lg"}
            width={"full"}
            border={"1px solid"}
            bg={"brand.primary"}
            borderRadius={"10px"}
            color={"#fff"}
            _hover={{
              bg: "brand.primary",
            }}
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {menuEditId ? "Update details" : "Add Area"}
          </Button>
          {menuEditId ? (
            <Button
              size={"lg"}
              mt={2}
              width={"full"}
              border={"1px solid"}
              variant={"danger"}
              borderRadius={"10px"}
              color={"#fff"}
              onClick={onDelPromptOpen}
            >
              Delete area
            </Button>
          ) : (
            ""
          )}
        </Box>
      </Flex>

      <CustomPrompt
        isOpen={isDelPromptOpen}
        onClose={onDelPromptClose}
        variant="danger"
        action={`delete this area`}
        primaryBtnAction={deleteItem}
        isActionLoading={isDeleteLoading}
      />
    </>
  );
};

interface MenuCardProps {
  imgSrc: string;
  name: string;
  location: string;
  onClick: () => void;
}

const MenuCard = ({ name, imgSrc, location, onClick }: MenuCardProps) => {
  return (
    <Box
      width={"150px"}
      borderRadius={"14px"}
      p={"15px"}
      bg={"#f9f9f9"}
      mt={"60px"}
      onClick={onClick}
      cursor={"pointer"}
    >
      <Box textAlign={"center"} mt={"-60px"}>
        <Avatar
          name={name}
          boxSize={"100px"}
          src={imgSrc}
          shadow={"rgba(0, 0, 0, 0.1) 0px 10px 50px"}
        />
      </Box>
      <Box mt={4}>
        <Text fontSize={"14px"} fontWeight={600} mb={1}>
          {name}
        </Text>
        <Flex gap={1} fontSize={"14px"} align={"center"}>
          <PiMapPinAreaDuotone />
          <Text mb={1}>{truncateText(location, 10)}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default ManageSlot;

"use client";
import {
  Heading,
  Flex,
  Box,
  Text,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import CustomInput from "../../../../../../utils/CustomInput";
import CustomMenu, { MenuItemsObj } from "../../../../../../utils/CustomMenu";
import { HiMiniTrash } from "react-icons/hi2";
import { showError, showSuccess } from "../../../../../../utils/Alerts";
import { IArea } from "../../manage-area/page";
import { useParams } from "next/navigation";
import Loader from "../../../../../../utils/Loader";
import CustomPrompt from "../../../../../../utils/CustomPrompt";
import ReviewModal from "@/app/(dashboard)/user/reserve-slot/ReviewModal";

const UpdateSlot = () => {
  const params = useParams();
  const [isCreateSlotLoading, setIsCreateSlotLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [areaItemArr, setAreaItemArr] = useState<MenuItemsObj[]>([]);
  const [area, setArea] = useState("");
  const {
    isOpen: isReviewModalOpen,
    onOpen: onReviewModalOpen,
    onClose: onReviewModalClose,
  } = useDisclosure();
  const {
    isOpen: isDelPromptOpen,
    onOpen: onDelPromptOpen,
    onClose: onDelPromptClose,
  } = useDisclosure();
  const [sections, setSections] = useState<
    {
      title: string;
      numberOfSlots: number | string;
      price: number | string;
    }[]
  >([
    {
      title: "",
      numberOfSlots: "",
      price: "",
    },
  ]);

  const fetchAreas = async () => {
    const fetchItems = await fetch("/api/area", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    if (res?.success) {
      const arr: MenuItemsObj[] = [];
      res?.data?.forEach((val: IArea) =>
        arr.push({ label: val.title, value: val._id })
      );
      setAreaItemArr(arr);
    } else {
      showError(res?.message || "An error occurred, could not fetch areas");
    }
  };

  const fetchSlot = async () => {
    setIsFetchLoading(true);
    const fetchItems = await fetch(`/api/slot?slotId=${params?.slotId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    if (res?.success) {
      setArea(res.data.area);
      const arr: any[] = [];
      res.data.sections.forEach(
        (val: { title: string; numberOfSlots: number }) => arr.push(val)
      );
      setSections(arr);
    } else {
      showError("An error occurred, could not fetch slot");
      // @ts-ignore
      window.location = "/admin/manage-slots";
    }
    setIsFetchLoading(false);
  };

  useEffect(() => {
    fetchSlot();
    fetchAreas();
  }, []);

  const addSection = () => {
    const updatedArr = [
      ...sections,
      {
        title: "",
        numberOfSlots: "",
        price: "",
      },
    ];

    setSections(updatedArr);
  };

  const deleteItem = async () => {
    setIsDeleteLoading(true);
    const deleteItem = await fetch(`/api/slot`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slotId: params.slotId }),
    });

    const res = await deleteItem.json();
    if (res?.success) {
      showSuccess("Slot deleted successfully");
      // @ts-ignore
      window.location = "/admin/manage-slots";
    } else {
      showError(res?.message || "An error occurred, please try again later");
    }
    setIsDeleteLoading(false);
  };

  const handleSubmit = async () => {
    // const { email, fullName, password, userType, confirmPassword } = formState;

    if (!area) {
      showError("Area is required");
      return;
    }

    const formData = { area, slotId: params?.slotId };

    const isSection = sections.length && sections[0].title;

    if (isSection) {
      const filteredSections = sections.filter((val) => val.title !== "");
      let fieldErr = "";
      filteredSections.forEach((val) => {
        if (!val.numberOfSlots) {
          fieldErr = "Enter number of slots";
        }
        if (!val.price) {
          fieldErr = "Enter price";
        }
      });

      if (fieldErr) {
        showError(fieldErr);
        return;
      }

      // formData.section = filteredSections
      Object.assign(formData, { sections: filteredSections });
    } else {
      showError("Enter at least one section info");
      return;
    }

    try {
      setIsCreateSlotLoading(true);
      const res = await fetch("/api/slot", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showSuccess("Slot updated successfully");
        // @ts-ignore
        window.location = "/admin/manage-slots";
      } else {
        const err = await res.json();
        showError(`${err.message}`);
      }
      setIsCreateSlotLoading(false);
    } catch (error) {
      setIsCreateSlotLoading(false);
      console.log(error);
      showError("Something went wrong");
    }
  };

  return (
    <Box
      mt={[3, 0]}
      rounded={"12px"}
      minH={"300px"}
      bg={"#fff"}
      px={["20px", "40px"]}
      py={"40px"}
    >
      <Loader isLoading={isFetchLoading} height="200px" />
      {!isFetchLoading ? (
        <>
          <Heading as={"h3"} fontSize={"24px"} fontWeight={700} mb={"32px"}>
            Slot Details
          </Heading>
          <Box width={["full"]} mb={"22px"}>
            <Text fontWeight={500} mb={2}>
              Select Area
            </Text>
            <CustomMenu
              value={area}
              items={areaItemArr}
              setValue={(val) => {
                setArea(val);
              }}
            />
          </Box>
          <Box
            border={"1px solid #111111"}
            shadow={
              "14px 27px 45px 4px #B0B5B90D, -14px -25px 45px 4px #B0B5B90D"
            }
            padding={"22px 20px"}
            rounded={"12px"}
            mb={"24px"}
          >
            <Heading as={"h4"} fontSize={"20px"} fontWeight={700} mb={"24px"}>
              Sections
            </Heading>
            {sections.map((sect, idx) => (
              <Flex
                gap={{ base: "10px", md: "20px" }}
                direction={{ base: "column", md: "row" }}
                mb={"22px"}
                key={`scts-${idx}`}
              >
                <Box width={{ base: "full", md: "31%" }}>
                  <CustomInput
                    label="Title"
                    value={sect.title}
                    placeholder="Section A, B or C"
                    onChange={({ target }) => {
                      let updatedArr = [...sections];
                      updatedArr[idx] = {
                        ...sect,
                        title: target.value,
                      };
                      setSections(updatedArr);
                    }}
                    greyInput={true}
                  />
                </Box>
                <Box width={{ base: "full", md: "31%" }}>
                  <CustomInput
                    label="Number of slots"
                    value={sect.numberOfSlots}
                    type={"number"}
                    placeholder="Enter number of slots"
                    onChange={({ target }) => {
                      let updatedArr = [...sections];
                      updatedArr[idx] = {
                        ...sect,
                        numberOfSlots: target.value,
                      };
                      setSections(updatedArr);
                    }}
                    greyInput={true}
                  />
                </Box>
                <Box width={{ base: "full", md: "31%" }}>
                  <CustomInput
                    label="Price"
                    value={sect.price}
                    type={"number"}
                    placeholder="Enter price"
                    onChange={({ target }) => {
                      let updatedArr = [...sections];
                      updatedArr[idx] = {
                        ...sect,
                        price: target.value,
                      };
                      setSections(updatedArr);
                    }}
                    greyInput={true}
                  />
                </Box>
                <Box width={{ base: "full", md: "6%" }}>
                  <Text fontWeight={500} color={"transparent"} mb={"17px"}>
                    Delete
                  </Text>
                  <Flex
                    bg={"#F2BFBF"}
                    rounded={"50%"}
                    boxSize={"30px"}
                    justify={"center"}
                    align={"center"}
                    cursor={"pointer"}
                    onClick={() => {
                      setSections((prevSects) =>
                        prevSects.filter((_, i) => i !== idx)
                      );
                    }}
                  >
                    <Icon as={HiMiniTrash} color={"root.dangerDark"} />
                  </Flex>
                </Box>
              </Flex>
            ))}
            <Button
              rightIcon={<FiPlus />}
              variant={"outlineDashed"}
              width={"full"}
              rounded={"8px"}
              onClick={addSection}
            >
              Add Section
            </Button>
          </Box>

          <Button
            width={"full"}
            mt={5}
            variant={"primary"}
            onClick={handleSubmit}
            isLoading={isCreateSlotLoading}
          >
            Update
          </Button>
          <Button
            width={"full"}
            mt={5}
            variant={"light"}
            onClick={onReviewModalOpen}
          >
            Reviews
          </Button>
          <Button
            width={"full"}
            mt={5}
            variant={"danger"}
            onClick={onDelPromptOpen}
          >
            Delete
          </Button>
        </>
      ) : (
        ""
      )}

      <CustomPrompt
        isOpen={isDelPromptOpen}
        onClose={onDelPromptClose}
        variant="danger"
        action={`delete this slot`}
        primaryBtnAction={deleteItem}
        isActionLoading={isDeleteLoading}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        slotId={typeof params.slotId === "string" ? params.slotId : ""}
        onClose={onReviewModalClose}
        fromAdmin={true}
      />
    </Box>
  );
};

export default UpdateSlot;

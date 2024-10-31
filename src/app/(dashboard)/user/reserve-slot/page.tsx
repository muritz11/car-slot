"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import CustomInput from "../../../../../utils/CustomInput";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../../utils/Alerts";
import { truncateText } from "../../../../../utils/helpers";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import Loader from "../../../../../utils/Loader";
import { IArea } from "../../admin/manage-area/page";
import { TiTimes } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { IoMdArrowRoundBack } from "react-icons/io";

export interface ISlot {
  _id: string;
  area: IArea;
  sections: { title: string; numberOfSlots: number; _id: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ISection {
  title: string;
  numberOfSlots: number;
}

const ReserveSlot = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [areaBookId, setAreaBookId] = useState<undefined | string>(undefined);
  const [fetchedSlots, setFetchedSlots] = useState<ISlot[]>([]);
  const [fetchedBookings, setFetchedBookings] = useState<any[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const { data: session } = useSession();
  const [formState, setFormState] = useState<{
    slot: string;
    sectionIndex: string | number;
    sectionSlotNumber: string | number;
  }>({
    slot: "",
    sectionIndex: "",
    sectionSlotNumber: "",
  });
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({
    title: "",
    location: "",
  });

  const setBookingInfo = (
    slot: string,
    sectionIndex: number,
    sectionSlotNumber: number
  ) => {
    setFormState({ slot, sectionIndex, sectionSlotNumber });
  };

  const fetchSlots = async () => {
    setIsFetchLoading(true);
    const fetchItems = await fetch("/api/slot", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    console.log(res);
    if (res?.success) {
      setFetchedSlots(res?.data);
    } else {
      showError(res?.message || "An error occurred, could not fetch areas");
    }
    setIsFetchLoading(false);
  };

  const fetchBookings = async () => {
    const fetchItems = await fetch("/api/booking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    console.log(res);
    if (res?.success) {
      setFetchedBookings(res?.data);
      console.log("first", res?.data);
    } else {
      console.log("An error occurred, could not fetch bookings", res);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  const handleInputs = (e: any) => {
    const { value, name } = e.target;

    setSelectedSlotInfo({ ...selectedSlotInfo, [name]: value });
  };

  const [preview, setPreview] = useState<string | undefined>(undefined);

  const selectMenu = (menuId: string) => {
    setAreaBookId(menuId);
    const selectedSlot = fetchedSlots?.find((value) => value?._id === menuId);
    setSelectedSlotInfo({
      ...selectedSlotInfo,
      title: selectedSlot?.area.title || "Area title",
      location: selectedSlot?.area.location || "Area location",
    });
    setSections(selectedSlot?.sections || []);
    setPreview(selectedSlot?.area?.coverUrl);
  };

  const resetSelectedSlotInfo = () => {
    setSelectedSlotInfo({
      title: "",
      location: "",
    });
  };

  const resetMenuForm = () => {
    setAreaBookId(undefined);
    resetSelectedSlotInfo();
    setFormState({
      ...formState,
      slot: "",
      sectionIndex: "",
      sectionSlotNumber: "",
    });
  };

  const handleSubmit = async () => {
    const { slot, sectionIndex, sectionSlotNumber } = formState;

    console.log(formState);
    if (!slot || typeof sectionIndex === "string") {
      showError("An error occurred");
      return;
    }

    if (!sectionSlotNumber) {
      showError("Select slot");
      return;
    }

    try {
      setisLoading(true);
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          // @ts-ignore
          user_id: session?.user ? session?.user.id : "",
        }),
      });

      if (res.ok) {
        resetMenuForm();
        showSuccess("Slot booked successfully");
        fetchSlots();
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
          display={{ base: areaBookId ? "none" : "block", md: "block" }}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"} mb={7}>
            <Heading
              fontSize={"20px"}
              color={"#666"}
              fontWeight={700}
              width={"20%"}
            >
              Slots
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
              {fetchedSlots?.map((menu) => (
                <MenuCard
                  key={menu?._id}
                  name={menu?.area.title}
                  onClick={() => selectMenu(menu?._id)}
                  location={menu.area.location}
                  imgSrc={menu.area.coverUrl || ""}
                />
              ))}
            </Flex>
          </Box>
        </Box>
        {/* menu detail */}
        <Box
          width={{ base: "full", md: "35%" }}
          transition={"height 0.3s ease-out"}
          display={{ base: areaBookId ? "block" : "none", md: "block" }}
          // height={"400px"}
          bg={"#fff"}
          borderRadius={"16px"}
          px={"16px"}
          py={"23px"}
        >
          <Flex justify={"space-between"} align={"center"} mb={"15px"}>
            <Box>
              <Text color={"#666"} fontWeight={600} fontSize={"14px"}>
                Book a slot
              </Text>
            </Box>
            <Box textAlign={"right"}>
              {areaBookId ? (
                <>
                  <Button
                    leftIcon={<TiTimes />}
                    fontSize={"14px"}
                    size={"sm"}
                    fontWeight={400}
                    bg={"brand.primary"}
                    color={"#fff"}
                    onClick={resetMenuForm}
                    display={{ base: "none", md: "inline-flex" }}
                    _hover={{ bg: "brand.primary" }}
                  >
                    clear
                  </Button>
                  <Button
                    leftIcon={<IoMdArrowRoundBack />}
                    fontSize={"14px"}
                    size={"sm"}
                    fontWeight={400}
                    bg={"brand.primary"}
                    color={"#fff"}
                    onClick={resetMenuForm}
                    display={{ base: "inline-flex", md: "none" }}
                    _hover={{ bg: "brand.primary" }}
                  >
                    Back
                  </Button>
                </>
              ) : (
                ""
              )}
            </Box>
          </Flex>
          {areaBookId ? (
            <>
              <Box mb={"40px"} display={"block"}>
                {/* Menu detail form */}
                <Flex
                  borderRadius="50%"
                  justify={"center"}
                  align={"center"}
                  boxSize={"80px"}
                  position={"relative"}
                  cursor={"pointer"}
                >
                  <Avatar
                    src={preview || ""}
                    boxSize={"100%"}
                    name={selectedSlotInfo.title}
                    background={"#D9D9D9"}
                    objectFit={"cover"}
                  />
                </Flex>
                <Box mt={5}>
                  <CustomInput
                    onChange={handleInputs}
                    name={"title"}
                    bg={"#F9F7F4"}
                    border={"none"}
                    placeholder={"Area title"}
                    value={selectedSlotInfo.title}
                    title={"Area title"}
                    readOnly
                  />
                </Box>
                <Box mt={5}>
                  <CustomInput
                    onChange={handleInputs}
                    name={"location"}
                    bg={"#F9F7F4"}
                    border={"none"}
                    placeholder={"Location"}
                    value={selectedSlotInfo.location}
                    title={"Location"}
                    readOnly
                  />
                </Box>
                <Box mt={5}>
                  {sections.map((val, idx) => (
                    <SectionUI
                      item={val}
                      sectionIndex={idx}
                      key={`sec-${idx}`}
                      setBookingInfo={setBookingInfo}
                      slotId={areaBookId}
                      selectedSectionSlotNumber={formState.sectionSlotNumber}
                      selectedSectionIndex={formState.sectionIndex}
                    />
                  ))}
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
                disabled={formState.sectionSlotNumber ? false : true}
              >
                Book slot
              </Button>
            </>
          ) : (
            <Text color={"brand.textMuted"} textAlign={"center"} mt={"150px"}>
              Select a slot to book
            </Text>
          )}
        </Box>
      </Flex>
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
          name={name || "Area title"}
          boxSize={"100px"}
          src={imgSrc}
          shadow={"rgba(0, 0, 0, 0.1) 0px 10px 50px"}
        />
      </Box>
      <Box mt={4}>
        <Text fontSize={"14px"} fontWeight={600} mb={1}>
          {name || "Area title"}
        </Text>
        <Flex gap={1} fontSize={"14px"} align={"center"}>
          <PiMapPinAreaDuotone />
          <Text mb={1}>{truncateText(location || "Area location", 10)}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

const SectionUI = ({
  item,
  slotId,
  sectionIndex,
  setBookingInfo,
  selectedSectionSlotNumber,
  selectedSectionIndex,
}: {
  item: ISection;
  slotId: string;
  sectionIndex: number;
  selectedSectionSlotNumber: string | number;
  selectedSectionIndex: string | number;
  setBookingInfo: (
    slot: string,
    sectionIndex: number,
    sectionSlotNumber: number
  ) => void;
}) => {
  const [slots, setSlots] = useState<number[]>([]);

  useEffect(() => {
    const arr = [];
    for (let i = 1; i <= item.numberOfSlots; i++) {
      arr.push(i);
    }
    setSlots(arr);
  }, []);

  return (
    <Box mb={5}>
      <Text textAlign={"center"} fontWeight={600} mb={2}>
        Section {item.title}
      </Text>
      <Flex justifyContent={"flex-start"} flexWrap={"wrap"} gap={3}>
        {slots.map((val) => (
          <Flex
            key={`sl-${val}`}
            boxSize={"35px"}
            bg={
              selectedSectionIndex === sectionIndex &&
              selectedSectionSlotNumber === val
                ? "green.900"
                : "green.600"
            }
            color={"#fff"}
            justify={"center"}
            align={"center"}
            fontWeight={600}
            rounded={"3px"}
            cursor={"pointer"}
            onClick={() => setBookingInfo(slotId, sectionIndex, val)}
          >
            {selectedSectionIndex === sectionIndex &&
            selectedSectionSlotNumber === val ? (
              <FaCheck />
            ) : (
              val
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default ReserveSlot;

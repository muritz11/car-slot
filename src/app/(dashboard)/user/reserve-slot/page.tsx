"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CustomInput from "../../../../../utils/CustomInput";
import { useEffect, useState } from "react";
import { showError } from "../../../../../utils/Alerts";
import { truncateText } from "../../../../../utils/helpers";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import Loader from "../../../../../utils/Loader";
import { IArea } from "../../admin/manage-area/page";
import { TiTimes } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import CustomDateTimePicker from "../../../../../utils/CustomDateTimePicker";
import "react-datepicker/dist/react-datepicker.css";
import ReviewModal from "./ReviewModal";

export interface ISlot {
  _id: string;
  area: IArea;
  sections: ISection[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ISection {
  title: string;
  numberOfSlots: number;
  price: number;
}

export interface IBooking {
  slot: ISlot;
  user_id: string;
  sectionIndex: number;
  sectionSlotNumber: number;
  bookingStatus: string;
}

const ReserveSlot = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [fetchedSlots, setFetchedSlots] = useState<ISlot[]>([]);
  const [fetchedBookings, setFetchedBookings] = useState<IBooking[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const { data: session } = useSession();

  const {
    isOpen: isReviewModalOpen,
    onOpen: onReviewModalOpen,
    onClose: onReviewModalClose,
  } = useDisclosure();
  const {
    isOpen: isPriceModalOpen,
    onOpen: onPriceModalOpen,
    onClose: onPriceModalClose,
  } = useDisclosure();
  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose,
  } = useDisclosure();
  const [formState, setFormState] = useState<{
    slot: string;
    sectionIndex: string | number;
    sectionSlotNumber: string | number;
    price: string | number;
    bookingDate: any;
  }>({
    slot: "",
    sectionIndex: "",
    sectionSlotNumber: "",
    price: "",
    bookingDate: null,
  });
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({
    id: "",
    title: "",
    location: "",
  });

  const setBookingInfo = (
    slot: string,
    sectionIndex: number,
    sectionSlotNumber: number,
    price: number
  ) => {
    setFormState({
      ...formState,
      slot,
      sectionIndex,
      sectionSlotNumber,
      price,
    });
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
    if (res?.success) {
      setFetchedSlots(res?.data);
    } else {
      showError(res?.message || "An error occurred, could not fetch areas");
    }
    setIsFetchLoading(false);
  };

  const fetchBookings = async () => {
    const fetchItems = await fetch("/api/booking?status=unavailable", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    if (res?.success) {
      setFetchedBookings(res?.data);
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

  const selectSlot = (itemId: string) => {
    const selectedSlot = fetchedSlots?.find((value) => value?._id === itemId);
    setSelectedSlotInfo({
      ...selectedSlotInfo,
      id: itemId,
      title: selectedSlot?.area?.title || "Area title",
      location: selectedSlot?.area?.location || "Area location",
    });
    setSections(selectedSlot?.sections || []);
    setPreview(selectedSlot?.area?.coverUrl);
  };

  const resetSelectedSlotInfo = () => {
    setSelectedSlotInfo({
      id: "",
      title: "",
      location: "",
    });
  };

  const resetMenuForm = () => {
    resetSelectedSlotInfo();
    setFormState({
      slot: "",
      sectionIndex: "",
      sectionSlotNumber: "",
      price: "",
      bookingDate: null,
    });
  };

  const handleSubmit = async () => {
    const { slot, sectionIndex, sectionSlotNumber, bookingDate } = formState;

    if (!slot || typeof sectionIndex === "string") {
      showError("An error occurred");
      return;
    }

    if (!sectionSlotNumber) {
      showError("Select slot");
      return;
    }

    if (!bookingDate) {
      showError("Select booking date");
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
        onPriceModalClose();
        onSuccessModalOpen();
        fetchSlots();
        fetchBookings();
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
          display={{
            base: selectedSlotInfo.id ? "none" : "block",
            md: "block",
          }}
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
          </Flex>

          <Box height={"550px"} overflowY={"auto"} className={"custom-scroll"}>
            <Flex justify={"flex-start"} flexWrap={"wrap"} gap={"10px"}>
              {/* todo: simulate empty menu */}
              <Loader isLoading={isFetchLoading} height={"300px"} />
              {!isFetchLoading &&
                fetchedSlots?.map((item) => (
                  <MenuCard
                    key={item?._id}
                    name={item?.area?.title}
                    onClick={() => selectSlot(item?._id)}
                    location={item?.area?.location}
                    imgSrc={item?.area?.coverUrl || ""}
                  />
                ))}
            </Flex>
          </Box>
        </Box>
        {/* menu detail */}
        <Box
          width={{ base: "full", md: "35%" }}
          transition={"height 0.3s ease-out"}
          display={{
            base: selectedSlotInfo.id ? "block" : "none",
            md: "block",
          }}
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
              {selectedSlotInfo.id ? (
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
          {selectedSlotInfo.id ? (
            <>
              <Box mb={"30px"} display={"block"}>
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
                  <Text
                    mt={3}
                    onClick={onReviewModalOpen}
                    cursor={"pointer"}
                    _hover={{ textDecor: "underline" }}
                  >
                    View reviews
                  </Text>
                </Box>
                <Box mt={5}>
                  {sections.map((val, idx) => (
                    <SectionUI
                      item={val}
                      sectionIndex={idx}
                      key={`sec-${idx}`}
                      setBookingInfo={setBookingInfo}
                      price={val.price}
                      slotId={selectedSlotInfo.id}
                      selectedSectionSlotNumber={formState.sectionSlotNumber}
                      selectedSectionIndex={formState.sectionIndex}
                      bookings={fetchedBookings}
                    />
                  ))}
                </Box>
                {/* slot note */}
                <Box>
                  <Text fontWeight={500}>Note:</Text>
                  <Flex align={"center"} gap={2}>
                    <Flex
                      boxSize={"15px"}
                      bg={"green.600"}
                      color={"#fff"}
                      justify={"center"}
                      align={"center"}
                      fontWeight={600}
                      rounded={"3px"}
                    ></Flex>
                    <Text fontSize={"14px"}>Available slots</Text>
                  </Flex>
                  <Flex align={"center"} gap={2}>
                    <Flex
                      boxSize={"15px"}
                      bg={"red.600"}
                      color={"#fff"}
                      justify={"center"}
                      align={"center"}
                      fontWeight={600}
                      rounded={"3px"}
                    ></Flex>
                    <Text fontSize={"14px"}>Unavailable slots</Text>
                  </Flex>
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
                onClick={onPriceModalOpen}
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

      <ReviewModal
        isOpen={isReviewModalOpen}
        slotId={selectedSlotInfo.id}
        onClose={onReviewModalClose}
      />
      <Modal isOpen={isPriceModalOpen} onClose={onPriceModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius={"12px"}>
          <ModalHeader>Book slot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <CustomDateTimePicker
                label="Select Booking date"
                value={formState.bookingDate}
                portalId="datepicker-portal"
                onChange={(date) =>
                  setFormState({ ...formState, bookingDate: date })
                }
              />
            </Box>
            <Text mt={2}>
              Slot price: <b>${formState.price}</b>
            </Text>
            <div id="datepicker-portal"></div>
          </ModalBody>

          <ModalFooter>
            <Button variant={"light"} mr={3} onClick={onPriceModalClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Proceed to payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius={"12px"}>
          {/* <ModalHeader>Book slot</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <Flex justify={"center"} mt={5}>
              <CiCircleCheck fontSize={"95px"} color={"#00C563"} />
            </Flex>
            <Text textAlign={"center"} fontWeight={500}>
              Payment successful
            </Text>
            <Text textAlign={"center"} mb={5}>
              Your slot has been booked
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
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
  bookings,
  price,
}: {
  item: ISection;
  slotId: string;
  sectionIndex: number;
  selectedSectionSlotNumber: string | number;
  selectedSectionIndex: string | number;
  price: number;
  setBookingInfo: (
    slot: string,
    sectionIndex: number,
    sectionSlotNumber: number,
    price: number
  ) => void;
  bookings: IBooking[];
}) => {
  const [slots, setSlots] = useState<number[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<number[]>([]);

  useEffect(() => {
    const arr = [];
    for (let i = 1; i <= item.numberOfSlots; i++) {
      arr.push(i);
    }
    setSlots(arr);
  }, []);

  useEffect(() => {
    const arr: number[] = [];
    const bks = bookings.filter(
      (val) => val.slot._id === slotId && val.sectionIndex === sectionIndex
    );
    bks.forEach((val) => arr.push(val.sectionSlotNumber));

    setUnavailableSlots(arr);
  }, []);

  const returnBg = (val: number) => {
    if (unavailableSlots.includes(val)) {
      return "red.600";
    }

    if (
      selectedSectionIndex === sectionIndex &&
      selectedSectionSlotNumber === val
    ) {
      return "green.900";
    }

    return "green.600";
  };

  return (
    <Box mb={5}>
      <Text
        textAlign={"center"}
        fontWeight={600}
        mb={2}
        textTransform={"capitalize"}
      >
        Section: {item.title}
      </Text>
      <Flex justifyContent={"flex-start"} flexWrap={"wrap"} gap={3}>
        {slots.map((val) => (
          <Flex
            key={`sl-${val}`}
            boxSize={"35px"}
            bg={returnBg(val)}
            color={"#fff"}
            justify={"center"}
            align={"center"}
            fontWeight={600}
            rounded={"3px"}
            cursor={"pointer"}
            onClick={() =>
              !unavailableSlots.includes(val)
                ? setBookingInfo(slotId, sectionIndex, val, price)
                : null
            }
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

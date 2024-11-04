"use client";
import {
  Heading,
  Flex,
  Box,
  Text,
  Button,
  Icon,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import CustomMenu, { MenuItemsObj } from "../../../../../utils/CustomMenu";
import { showError, showSuccess } from "../../../../../utils/Alerts";
import { IArea } from "../manage-area/page";
import Loader from "../../../../../utils/Loader";
import { IBooking, ISlot } from "../../user/reserve-slot/page";
import { IoMdSwitch } from "react-icons/io";
import { useSession } from "next-auth/react";
import { ImSpinner3 } from "react-icons/im";

const ManageSlots = () => {
  const [areaFilter, setAreaFilter] = useState("");
  const [fetchedSlots, setFetchedSlots] = useState<ISlot[]>([]);
  const [fetchedBookings, setFetchedBookings] = useState<IBooking[]>([]);
  const { data: session } = useSession();
  const [filteredSections, setFilteredSections] = useState<
    {
      title: string;
      numberOfSlots: number;
      price: number;
      areaName: string;
      slotId: string;
      sectionIndex: number;
    }[]
  >([]);
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [areaItemArr, setAreaItemArr] = useState<MenuItemsObj[]>([]);

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
      // console.log("fethdd", res?.data);
    } else {
      console.log("An error occurred, could not fetch bookings", res);
    }
  };

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
      setAreaFilter(arr[0].value || "");
    } else {
      showError(res?.message || "An error occurred, could not fetch areas");
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchSlots();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (areaFilter && fetchedSlots.length) {
      const filteredItems = fetchedSlots.filter(
        (val) => val?.area?._id === areaFilter
      );

      const sections: any = [];
      filteredItems?.forEach((slot) => {
        slot?.sections?.forEach((val, idx) =>
          sections.push({
            ...val,
            slotId: slot._id,
            areaName: slot?.area?.title,
            sectionIndex: idx,
          })
        );
      });

      setFilteredSections(sections);
    }
  }, [fetchedSlots, areaFilter]);

  return (
    <Box
      mt={[3, 0]}
      rounded={"12px"}
      minH={"300px"}
      bg={"#fff"}
      px={"20px"}
      py={"13px"}
    >
      <Flex
        justifyContent={"space-between"}
        align={"center"}
        // flexWrap={"wrap"}
        direction={{ base: "column", md: "row" }}
        gap={"15px"}
      >
        <Heading
          as={"h3"}
          fontSize={"20px"}
          fontWeight={700}
          letterSpacing={"-2%"}
        >
          Slots
        </Heading>
        <Flex gap={3}>
          <CustomMenu
            value={areaFilter}
            setValue={(val) => setAreaFilter(val)}
            items={areaItemArr}
            mini={true}
            placeholder="Filter by area"
          />
          <Button
            rightIcon={<FiPlus />}
            width={["full", "initial"]}
            size={"sm"}
            variant="primary"
            as={Link}
            href={"/admin/add-slot"}
          >
            Add Slot
          </Button>
        </Flex>
      </Flex>

      {/* table */}
      <TableContainer mt={"20px"}>
        <Table variant="simple">
          <Thead>
            <Tr color={"#534D59"}>
              <Th>Sections</Th>
              <Th>Area name</Th>
              <Th>Total slots</Th>
              <Th>Price</Th>
              <Th textAlign="right" pr={1}>
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSections?.map((val, idx) => (
              <RowItem
                val={val}
                bookings={fetchedBookings}
                slotId={val.slotId}
                refetchBookings={fetchBookings}
                // @ts-ignore
                user_id={session?.user ? session?.user.id : ""}
                sectionIndex={val.sectionIndex}
                key={`${val?.title + idx}`}
              />
            ))}
          </Tbody>
        </Table>
        <Loader isLoading={isFetchLoading} height={"200px"} />
        {!isFetchLoading && !filteredSections.length ? (
          <Text my={"70px"} textAlign={"center"} color={"root.textMuted"}>
            Nothing to show here, try changing the area filter
          </Text>
        ) : (
          ""
        )}
      </TableContainer>
    </Box>
  );
};

const RowItem = ({
  val,
  bookings,
  slotId,
  sectionIndex,
  user_id,
  refetchBookings,
}: {
  slotId: string;
  sectionIndex: number;
  user_id: string;
  bookings: IBooking[];
  refetchBookings: () => void;
  val: {
    title: string;
    numberOfSlots: number;
    price: number;
    areaName: string;
    slotId: string;
  };
}) => {
  const [loadingSlotNumber, setLoadingSlotNumber] = useState(0);
  const [slots, setSlots] = useState<number[]>([]);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<number[]>([]);
  const {
    isOpen: isStatusModalOpen,
    onOpen: onStatusModalOpen,
    onClose: onStatusModalClose,
  } = useDisclosure();

  useEffect(() => {
    const arr = [];
    for (let i = 1; i <= val.numberOfSlots; i++) {
      arr.push(i);
    }
    setSlots(arr);
  }, []);

  useEffect(() => {
    const arr: number[] = [];
    const arrII: number[] = [];
    const bks = bookings.filter(
      (val) =>
        val.slot._id === slotId &&
        val.sectionIndex === sectionIndex &&
        val.bookingStatus === "booked"
    );
    bks.forEach((val) => arr.push(val.sectionSlotNumber));

    const bksII = bookings.filter(
      (val) =>
        val.slot._id === slotId &&
        val.sectionIndex === sectionIndex &&
        val.bookingStatus === "unavailable"
    );
    bksII.forEach((val) => arrII.push(val.sectionSlotNumber));

    // console.log("unav", arr);
    setBookedSlots(arr);
    setUnavailableSlots(arrII);
  }, [bookings]);

  const returnBg = (val: number) => {
    if (bookedSlots.includes(val)) {
      return "orange.600";
    }

    if (unavailableSlots.includes(val)) {
      return "red.600";
    }

    return "green.600";
  };

  const changeStatus = async (sectionSlotNumber: number) => {
    if (!slotId || typeof sectionIndex === "string") {
      showError("An error occurred");
      return;
    }

    if (!sectionSlotNumber) {
      showError("Select slot");
      return;
    }

    try {
      setLoadingSlotNumber(sectionSlotNumber);
      const res = await fetch("/api/change-booking-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slot: slotId,
          sectionIndex,
          sectionSlotNumber,
          user_id,
        }),
      });

      if (res.ok) {
        refetchBookings();
        showSuccess("Slot status updated");
      } else {
        const err = await res.json();
        showError(`${err.message}`);
      }
      setLoadingSlotNumber(0);
    } catch (error) {
      setLoadingSlotNumber(0);
      console.log(error);
      showError("Something went wrong");
    }
  };

  return (
    <>
      <Tr>
        <Td textTransform={"capitalize"}>{val?.title}</Td>
        <Td textTransform={"capitalize"}>{val?.areaName}</Td>
        <Td>{val?.numberOfSlots}</Td>
        <Td>${val?.price}</Td>
        <Td pr={1}>
          <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
            <Tooltip label={"Update slot"} hasArrow>
              <Flex
                as={Link}
                align={"center"}
                href={`/admin/update-slot/${val?.slotId}`}
              >
                <Icon
                  as={FiEdit}
                  color={"root.primary"}
                  fontSize={"17px"}
                  cursor={"pointer"}
                />
              </Flex>
            </Tooltip>
            <Tooltip label={"Change status"} hasArrow>
              <Flex align={"center"} onClick={onStatusModalOpen}>
                <Icon
                  as={IoMdSwitch}
                  color={"root.primary"}
                  fontSize={"17px"}
                  cursor={"pointer"}
                />
              </Flex>
            </Tooltip>
          </Flex>
        </Td>
      </Tr>

      <Modal isOpen={isStatusModalOpen} onClose={onStatusModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius={"12px"}>
          <ModalHeader>Change status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent={"flex-start"} flexWrap={"wrap"} gap={3}>
              {slots.map((slotNumber) => (
                <Flex
                  key={`sl-${slotNumber}`}
                  boxSize={"35px"}
                  bg={returnBg(slotNumber)}
                  color={"#fff"}
                  justify={"center"}
                  align={"center"}
                  fontWeight={600}
                  rounded={"3px"}
                  cursor={"pointer"}
                  onClick={() => changeStatus(slotNumber)}
                >
                  {loadingSlotNumber === slotNumber ? (
                    <ImSpinner3 />
                  ) : (
                    slotNumber
                  )}
                </Flex>
              ))}
            </Flex>
            {/* slot note */}
            <Box mt={2}>
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
                  bg={"orange.600"}
                  color={"#fff"}
                  justify={"center"}
                  align={"center"}
                  fontWeight={600}
                  rounded={"3px"}
                ></Flex>
                <Text fontSize={"14px"}>Booked slots</Text>
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
              <Text mt={2} fontSize={"14px"} color={"red.600"}>
                * Click on a slot to toggle its availability
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageSlots;

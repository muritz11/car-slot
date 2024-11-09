"use client";
import {
  Heading,
  Flex,
  Box,
  Icon,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../../utils/Alerts";
import Loader from "../../../../../utils/Loader";
import { useSession } from "next-auth/react";
import { ISlot } from "../../user/reserve-slot/page";
// @ts-ignore
import { DateTime } from "luxon";
import LabelStatus from "../../../../../utils/LabelStatus";
import { ImExit } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import CustomPrompt from "../../../../../utils/CustomPrompt";

interface IBooking {
  _id: string;
  slot: ISlot;
  user_id: string;
  sectionIndex: number;
  sectionSlotNumber: number;
  price?: number;
  bookingStatus:
    | "booked"
    | "exit-requested"
    | "cancelled"
    | "unavailable"
    | "completed";
  bookingDate?: Date;
}

const MyBookings = () => {
  const [fetchedBookings, setFetchedBookings] = useState<IBooking[]>([]);
  const { data: session } = useSession();
  const [isFetchLoading, setIsFetchLoading] = useState(true);

  const fetchBookings = async () => {
    setIsFetchLoading(true);
    const fetchItems = await fetch(
      // @ts-ignore
      `/api/booking?userId=${session?.user?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await fetchItems.json();
    if (res?.success) {
      setFetchedBookings(res?.data);
    } else {
      showError(res?.message || "An error occurred, could not fetch bookings");
    }
    setIsFetchLoading(false);
  };

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session?.user]);

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
          Bookings
        </Heading>
      </Flex>

      {/* table */}
      <TableContainer mt={"20px"}>
        <Table variant="simple">
          <Thead>
            <Tr color={"#534D59"}>
              <Th>Area</Th>
              <Th>Section</Th>
              <Th>Slot number</Th>
              <Th>Price</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th textAlign="right" pr={1}>
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {fetchedBookings?.map((val) => (
              <RowItem val={val} refetch={fetchBookings} key={`${val?._id}`} />
            ))}
          </Tbody>
        </Table>
        <Loader isLoading={isFetchLoading} height={"200px"} />
        {!isFetchLoading && !fetchedBookings.length ? (
          <Text my={"70px"} textAlign={"center"} color={"root.textMuted"}>
            Nothing to show here, Seems you have not booked any slot yet
          </Text>
        ) : (
          ""
        )}
      </TableContainer>
    </Box>
  );
};

const RowItem = ({ val, refetch }: { val: IBooking; refetch: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const deadline = DateTime.fromISO(val.bookingDate);
  const section = val?.slot?.sections[val.sectionIndex];
  const {
    isOpen: isExitPromptOpen,
    onOpen: onExitPromptOpen,
    onClose: onExitPromptClose,
  } = useDisclosure();
  const {
    isOpen: isCancelPromptOpen,
    onOpen: onCancelPromptOpen,
    onClose: onCancelPromptClose,
  } = useDisclosure();

  const updateBookingStatus = async (status: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/update-booking-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: val._id,
          status,
        }),
      });

      if (res.ok) {
        refetch();
        showSuccess("Success");
        onExitPromptClose();
        onCancelPromptClose();
      } else {
        const err = await res.json();
        showError(err?.message || "An error occured, try again later");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showError("Something went wrong");
    }
  };

  return (
    <>
      <Tr>
        <Td textTransform={"capitalize"}>{val?.slot?.area?.title || "N/A"}</Td>
        <Td textTransform={"capitalize"}>{section?.title || "N/A"}</Td>
        <Td>
          <Flex
            boxSize={"25px"}
            bg={"green.600"}
            color={"#fff"}
            justify={"center"}
            align={"center"}
            fontWeight={600}
            rounded={"3px"}
          >
            {val.sectionSlotNumber}
          </Flex>
        </Td>
        <Td>${val?.price}</Td>
        <Td>{deadline?.toFormat("dd LLL, yyyy hh:mm a")}</Td>
        <Td textAlign="center" fontSize={"10px"}>
          <Flex justify={"center"}>
            <LabelStatus status={val.bookingStatus} />
          </Flex>
        </Td>
        <Td pr={1}>
          <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
            {val.bookingStatus === "booked" ? (
              <>
                <Tooltip label="Exit parking slot" hasArrow>
                  <Flex align={"center"}>
                    <Icon
                      as={ImExit}
                      color={"root.primary"}
                      fontSize={"17px"}
                      cursor={"pointer"}
                      onClick={onExitPromptOpen}
                    />
                  </Flex>
                </Tooltip>
                <Tooltip label="Cancel" hasArrow>
                  <Flex align={"center"}>
                    <Icon
                      as={MdCancel}
                      color={"red.600"}
                      fontSize={"17px"}
                      cursor={"pointer"}
                      onClick={onCancelPromptOpen}
                    />
                  </Flex>
                </Tooltip>
              </>
            ) : (
              ""
            )}
          </Flex>
        </Td>
      </Tr>

      <CustomPrompt
        isOpen={isExitPromptOpen}
        onClose={onExitPromptClose}
        variant="success"
        action={`request slot exit`}
        primaryBtnAction={() => updateBookingStatus("exit-requested")}
        isActionLoading={isLoading}
      />

      <CustomPrompt
        isOpen={isCancelPromptOpen}
        onClose={onCancelPromptClose}
        variant="danger"
        action={`cancel this booking`}
        primaryBtnAction={() => updateBookingStatus("cancelled")}
        isActionLoading={isLoading}
      />
    </>
  );
};

export default MyBookings;

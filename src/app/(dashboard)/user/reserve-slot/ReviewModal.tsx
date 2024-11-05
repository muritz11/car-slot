"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../../utils/Alerts";
import Loader from "../../../../../utils/Loader";
import { ISlot } from "./page";
// @ts-ignore
import { DateTime } from "luxon";
import { RiSeparator } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";

interface ElemProp {
  isOpen: boolean;
  slotId: string;
  onClose: () => void;
  fromAdmin?: boolean;
}

interface IRevew {
  _id: string;
  slot: ISlot;
  user: { _id: string; fullName: string };
  review: string;
  updatedAt: any;
}

const ReviewModal = ({ isOpen, onClose, slotId, fromAdmin }: ElemProp) => {
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedReviews, setFetchedReviews] = useState<IRevew[]>([]);
  const [formState, setformState] = useState({
    review: "",
  });

  const fetchReviews = async () => {
    if (slotId && session?.user) {
      setIsFetchLoading(true);
      const fetchItems = await fetch(`/api/review?slotId=${slotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await fetchItems.json();
      if (res?.success) {
        setFetchedReviews(res?.data);
      } else {
        showError("An error occurred, could not fetch reviews");
        console.log("An error occurred, could not fetch reviews", res);
      }
      setIsFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [slotId, session?.user]);

  const deleteItem = async (reviewId: string) => {
    try {
      const res = await fetch("/api/review", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      if (res.ok) {
        fetchReviews();
        showSuccess("Review deleted successfully");
      } else {
        const err = await res.json();
        showError(err?.message || "An error occurred");
      }
    } catch (error) {
      console.log(error);
      showError("Something went wrong");
    }
  };

  const handleSubmit = async () => {
    const { review } = formState;

    if (!review) {
      showError("Enter your review");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotId,
          review,
          // @ts-ignore
          user_id: session?.user ? session?.user.id : "",
        }),
      });

      if (res.ok) {
        fetchReviews();
        showSuccess("Review submitted successfully");
        setformState({ review: "" });
        setShowReviewForm(false);
      } else {
        const err = await res.json();
        showError(`${err.message}` || "An error occurred");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showError("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius={"12px"}>
        <ModalHeader>Reviews</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Loader isLoading={isFetchLoading} height={"100px"} />
          {showReviewForm ? (
            <Flex direction={"column"} gap={3}>
              <Flex>
                <Button
                  leftIcon={<IoMdArrowRoundBack />}
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => setShowReviewForm(false)}
                >
                  Back to reviews
                </Button>
              </Flex>
              <FormControl>
                <FormLabel fontWeight={500} color={"#48494D"}>
                  Write a review
                </FormLabel>
                <Textarea
                  rounded={"8px"}
                  border={"1px"}
                  borderColor={"#D3D4DA"}
                  name={"review"}
                  value={formState.review}
                  onChange={(e) =>
                    setformState({ ...formState, review: e.target.value })
                  }
                  minH={"150px"}
                />
              </FormControl>
              <Button
                variant={"primary"}
                width={"full"}
                mt={5}
                mb={3}
                onClick={handleSubmit}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </Flex>
          ) : (
            <Box mb={5}>
              {fetchedReviews.map((review, idx) => {
                const dateTime = DateTime.fromISO(review?.updatedAt);
                // @ts-ignore
                const date = dateTime.toRelativeCalendar();

                return (
                  <Box key={review?._id}>
                    {idx !== 0 ? <Box as="hr" my={3} /> : ""}
                    <Flex align={"center"} gap={2}>
                      <Avatar
                        src={undefined}
                        boxSize={"28px"}
                        fontSize={"8px"}
                      />
                      <Text textTransform={"capitalize"}>
                        {review?.user?.fullName}
                      </Text>
                    </Flex>
                    <Text fontSize={"14px"} my={2}>
                      {review?.review}
                    </Text>
                    <Flex align={"center"} gap={2}>
                      <Text fontSize={"12px"}>
                        <em>Posted {date}</em>
                      </Text>
                      {/* @ts-ignore */}
                      {review?.user?._id === session?.user?.id ? (
                        <>
                          <RiSeparator />
                          <Button
                            variant={"link"}
                            onClick={() => deleteItem(review?._id)}
                            size={"xs"}
                            fontWeight={400}
                            color={"red.600"}
                            // isLoading={isDeleteReviewLoading}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
                    </Flex>
                  </Box>
                );
              })}
              {!fetchedReviews?.length ? (
                <Text
                  color={"brand.textMuted"}
                  textAlign={"center"}
                  mt={7}
                  mb={10}
                >
                  No reviews yet
                </Text>
              ) : (
                ""
              )}
              {!fromAdmin ? (
                <Button
                  variant={"outline"}
                  width={"full"}
                  mt={5}
                  rightIcon={<FiEdit />}
                  onClick={() => setShowReviewForm(true)}
                >
                  Write review
                </Button>
              ) : (
                ""
              )}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;

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

interface ElemProp {
  isOpen: boolean;
  slotId: string;
  onClose: () => void;
}

interface IRevew {
  _id: string;
  slot: ISlot;
  user: { _id: string; fullName: string };
  review: string;
  updatedAt: any;
}

const ReviewModal = ({ isOpen, onClose, slotId }: ElemProp) => {
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedReviews, setFetchedReviews] = useState<IRevew[]>([]);
  const [formState, setformState] = useState({
    review: "",
  });

  const fetchReviews = async () => {
    if (slotId) {
      setIsFetchLoading(true);
      const fetchItems = await fetch(`/api/review?slotId=${slotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await fetchItems.json();
      if (res.ok) {
        setFetchedReviews(res?.data);
        console.log("first", res?.data);
      } else {
        showError("An error occurred, could not fetch reviews");
        console.log("An error occurred, could not fetch reviews", res);
      }
      setIsFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [slotId]);

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
        // resetMenuForm();
        // onPriceModalClose();
        // onSuccessModalOpen();
        // fetchSlots();
        // fetchBookings();
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={"12px"}>
        <ModalHeader>Reviews</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Loader isLoading={isFetchLoading} height={"100px"} />

          {showReviewForm ? (
            <Flex direction={"column"} gap={3}>
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
                  placeholder={"Optional"}
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
            <>
              {fetchedReviews.map((review) => {
                const dateTime = DateTime.fromISO(review?.updatedAt);
                // @ts-ignore
                const date = dateTime.toRelativeCalendar();

                return (
                  <Box key={review?._id}>
                    <Box as="hr" my={4} />
                    <Flex align={"center"} gap={2}>
                      <Avatar
                        name={review?.user?.fullName}
                        boxSize={"28px"}
                        fontSize={"8px"}
                      />
                      <Text textTransform={"capitalize"}>
                        {review?.user?.fullName}
                      </Text>
                      {/* @ts-ignore */}
                      {review?.user?._id === session?.user?.id ? (
                        <Button
                          variant={"link"}
                          // onClick={() => deleteReview(review?._id)}
                          size={"xs"}
                          fontWeight={400}
                          color={"red.600"}
                          ms={4}
                          // isLoading={isDeleteReviewLoading}
                        >
                          Delete
                        </Button>
                      ) : (
                        ""
                      )}
                    </Flex>
                    <Text fontSize={"14px"} my={2}>
                      {review?.review}
                    </Text>
                    <Text fontSize={"12px"}>
                      <em>Posted {date}</em>
                    </Text>
                  </Box>
                );
              })}
              {fetchedReviews.map((review) => {
                const dateTime = DateTime.fromISO(review?.updatedAt);
                // @ts-ignore
                const date = dateTime.toRelativeCalendar();

                return (
                  <Box key={review?._id}>
                    <Box as="hr" my={4} />
                    <Flex align={"center"} gap={2}>
                      <Avatar
                        name={review?.user?.fullName}
                        boxSize={"28px"}
                        fontSize={"8px"}
                      />
                      <Text textTransform={"capitalize"}>
                        {review?.user?.fullName}
                      </Text>
                      {/* @ts-ignore */}
                      {review?.user?._id === session?.user?.id ? (
                        <Button
                          variant={"link"}
                          // onClick={() => deleteReview(review?._id)}
                          size={"xs"}
                          fontWeight={400}
                          color={"red.600"}
                          ms={4}
                          // isLoading={isDeleteReviewLoading}
                        >
                          Delete
                        </Button>
                      ) : (
                        ""
                      )}
                    </Flex>
                    <Text fontSize={"14px"} my={2}>
                      {review?.review}
                    </Text>
                    <Text fontSize={"12px"}>
                      <em>Posted {date}</em>
                    </Text>
                  </Box>
                );
              })}
              {fetchedReviews.map((review) => {
                const dateTime = DateTime.fromISO(review?.updatedAt);
                // @ts-ignore
                const date = dateTime.toRelativeCalendar();

                return (
                  <Box key={review?._id}>
                    <Box as="hr" my={4} />
                    <Flex align={"center"} gap={2}>
                      <Avatar
                        name={review?.user?.fullName}
                        boxSize={"28px"}
                        fontSize={"8px"}
                      />
                      <Text textTransform={"capitalize"}>
                        {review?.user?.fullName}
                      </Text>
                      {/* @ts-ignore */}
                      {review?.user?._id === session?.user?.id ? (
                        <Button
                          variant={"link"}
                          // onClick={() => deleteReview(review?._id)}
                          size={"xs"}
                          fontWeight={400}
                          color={"red.600"}
                          ms={4}
                          // isLoading={isDeleteReviewLoading}
                        >
                          Delete
                        </Button>
                      ) : (
                        ""
                      )}
                    </Flex>
                    <Text fontSize={"14px"} my={2}>
                      {review?.review}
                    </Text>
                    <Text fontSize={"12px"}>
                      <em>Posted {date}</em>
                    </Text>
                  </Box>
                );
              })}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  Button,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import { GoAlertFill } from "react-icons/go";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  isActionLoading: boolean;
  primaryBtnAction: () => void;
  action: string;
  variant?: "warning" | "success" | "danger";
}

const CustomPrompt = ({
  isOpen,
  onClose,
  primaryBtnAction,
  isActionLoading,
  action,
  variant = "warning",
}: ModalProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={["xs", "sm"]} isCentered>
        <ModalOverlay />
        <ModalContent rounded={"24px"}>
          <ModalCloseButton />
          <ModalBody padding={[4, 5]}>
            <Box>
              <Flex gap={3}>
                <Flex
                  mt={2}
                  justify={"center"}
                  align={"center"}
                  boxSize={"50px"}
                  rounded={"50%"}
                  bg={`brand.${variant}Tint`}
                  flexShrink={0}
                >
                  <Icon
                    as={GoAlertFill}
                    fontSize={"25px"}
                    color={`brand.${variant}`}
                  />
                </Flex>
                <Box>
                  <Text fontSize={"25px"} fontWeight={600}>
                    Warning
                  </Text>
                  <Text fontWeight={500}>
                    Are you sure you want to {action}?
                  </Text>
                </Box>
              </Flex>
              <Flex justify={["flex-end"]} gap={2} mt={5} mb={2}>
                <Button
                  variant={variant}
                  rounded={"12px"}
                  onClick={primaryBtnAction}
                  isLoading={isActionLoading}
                >
                  Yes
                </Button>
                <Button variant={"light"} rounded={"12px"} onClick={onClose}>
                  No
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomPrompt;

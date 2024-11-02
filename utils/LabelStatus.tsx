import { Flex, Text } from "@chakra-ui/react";

const LabelStatus = ({ status }: { status: string }) => {
  let bg = "yellow.100";
  let color = "yellow.600";

  switch (status?.toLowerCase()) {
    case "completed":
      bg = "green.100";
      color = "green.600";
      break;

    case "cancelled":
      bg = "red.100";
      color = "red.600";
      break;

    case "unavailable":
      bg = "red.100";
      color = "red.600";
      break;

    case "booked":
      bg = "blue.100";
      color = "blue.600";
      break;

    case "exit-requested":
      bg = "gray.100";
      color = "gray.600";
      break;
  }

  return (
    <Flex
      gap={1}
      align={"center"}
      justify={"center"}
      bg={bg}
      color={color}
      py={"2px"}
      px={2}
      rounded={"full"}
      fontSize={"12px"}
      width={"max-content"}
    >
      <Text fontWeight={500}>{status}</Text>
    </Flex>
  );
};

export default LabelStatus;

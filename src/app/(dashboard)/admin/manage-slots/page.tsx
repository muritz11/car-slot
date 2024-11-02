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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import CustomMenu, { MenuItemsObj } from "../../../../../utils/CustomMenu";
import { showError } from "../../../../../utils/Alerts";
import { IArea } from "../manage-area/page";
import Loader from "../../../../../utils/Loader";
import { ISlot } from "../../user/reserve-slot/page";

const ManageSlots = () => {
  const [areaFilter, setAreaFilter] = useState("");
  const [fetchedSlots, setFetchedSlots] = useState<ISlot[]>([]);
  const [filteredSections, setFilteredSections] = useState<
    {
      title: string;
      numberOfSlots: number;
      price: number;
      areaName: string;
      slotId: string;
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
  }, []);

  useEffect(() => {
    if (areaFilter && fetchedSlots.length) {
      const filteredItems = fetchedSlots.filter(
        (val) => val?.area?._id === areaFilter
      );

      const sections: any = [];
      filteredItems?.forEach((slot) => {
        slot?.sections?.forEach((val) =>
          sections.push({
            ...val,
            slotId: slot._id,
            areaName: slot?.area?.title,
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
              <RowItem val={val} key={`${val?.title + idx}`} />
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
}: {
  val: {
    title: string;
    numberOfSlots: number;
    price: number;
    areaName: string;
    slotId: string;
  };
}) => {
  return (
    <>
      <Tr>
        <Td textTransform={"capitalize"}>{val?.title}</Td>
        <Td textTransform={"capitalize"}>{val?.areaName}</Td>
        <Td>{val?.numberOfSlots}</Td>
        <Td>${val?.price}</Td>
        <Td pr={1}>
          <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
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
          </Flex>
        </Td>
      </Tr>

      {/* <CustomPrompt
          isOpen={isDelModalOpen}
          onClose={onDelModalClose}
          variant="danger"
          action={`delete this client`}
          primaryBtnAction={deleteItem}
          isActionLoading={isDelItemLoading}
        /> */}
    </>
  );
};

export default ManageSlots;

"use client";
import DashCard from "@/app/components/DashCard";
import { Box, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";
import { IoBookOutline } from "react-icons/io5";
import { LuCircleDollarSign } from "react-icons/lu";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import Chart from "react-apexcharts";
import { showError } from "../../../../utils/Alerts";

interface IStat {
  earnings: number;
  activeBookingCount: number;
  exitRequestCount: number;
  areaCount: number;
}

const Admin = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [dashStats, setDashStats] = useState<IStat>({
    earnings: 0,
    activeBookingCount: 0,
    exitRequestCount: 0,
    areaCount: 0,
  });

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    title: {
      text: `Bookings Overview (${new Date().getFullYear()})`,
      align: "center",
    },
    colors: ["#008FFB", "#FF4560", "#00E396"],
    dataLabels: {
      enabled: false,
    },
  };

  const fetchDashStat = async () => {
    const fetchItems = await fetch(`/api/dash-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetchItems.json();
    if (res?.success) {
      // Initialize array for each booking status
      const booked = new Array(12).fill(0);
      const cancelled = new Array(12).fill(0);
      const completed = new Array(12).fill(0);

      res?.data?.bookingChartSeries.forEach((item: any) => {
        const monthIndex = item._id.month - 1; // Months are 1-indexed
        if (item._id.status === "booked") booked[monthIndex] = item.count;
        if (item._id.status === "cancelled") cancelled[monthIndex] = item.count;
        if (item._id.status === "completed") completed[monthIndex] = item.count;
      });

      setSeries([
        { name: "Booked", data: booked },
        { name: "Cancelled", data: cancelled },
        { name: "Completed", data: completed },
      ]);

      setDashStats(res?.data?.stats);
    } else {
      showError(
        res?.message || "An error occurred, could not fetch dashboard stats"
      );
    }
  };

  useEffect(() => {
    fetchDashStat();
  }, []);

  return (
    <Box px={[0, "20px"]} py={"13px"} mt={[3, 0]}>
      <Grid
        gridTemplateColumns={"repeat(auto-fit, minmax(200px, 1fr))"}
        gap={"24px"}
      >
        <GridItem>
          <DashCard
            title="Total earnings"
            stat={`$${dashStats?.earnings}`}
            icon={LuCircleDollarSign}
            route="/admin/bookings"
            iconColor={["#C3AAD5", "#4B0082"]}
          />
        </GridItem>
        <GridItem>
          <DashCard
            title="Slot exit request"
            stat={dashStats?.exitRequestCount}
            icon={ImExit}
            iconColor={["#FAE6E5", "#534C4C"]}
            route="/admin/bookings"
          />
        </GridItem>
        <GridItem>
          <DashCard
            title="Active bookings"
            stat={dashStats?.activeBookingCount}
            icon={IoBookOutline}
            iconColor={["#FFF4F0", "#FF8F6B"]}
            route="/admin/bookings"
          />
        </GridItem>
        <GridItem>
          <DashCard
            title="Campus Areas"
            stat={dashStats?.areaCount}
            icon={PiMapPinAreaDuotone}
            iconColor={["#FFF9E5", "#FFC400"]}
            route="/admin/manage-area"
          />
        </GridItem>
      </Grid>

      <Box
        // mt={[3, 0]}
        mt={"24px"}
        rounded={"12px"}
        minH={"300px"}
        bg={"#fff"}
        px={"20px"}
        py={"13px"}
      >
        {/* bar chart */}
        <Box>
          <div id="chart">
            {/* @ts-ignore */}
            <Chart options={options} series={series} type="bar" height={350} />
          </div>
          <div id="html-dist"></div>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;

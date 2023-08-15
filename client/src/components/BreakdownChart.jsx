import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetPieQuery } from "state/api";

const dateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 as month is zero-based
  const day = String(date.getDate()).padStart(2, '0');

  // Format the date string
  const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  
  return formattedDate;
}

const BreakdownChart = ({ isDashboard = false, name, startDate, endDate }) => {
  const { data, isLoading } = useGetPieQuery({id: name, startDate: dateToString(startDate), endDate: dateToString(endDate)});
  const theme = useTheme();

  if (!data) return "Loading...";

  const colors = [
    "green", // theme.palette.secondary[500],
    "red", // theme.palette.secondary[400],
    "gray", // theme.palette.secondary[300],
    "yellow", // theme.palette.secondary[200],
    "pink", // theme.palette.secondary[100],
  ];
  const formattedData = [
    {
      id: 'approved',
      label: 'Approved',
      value: data.approvedAmount,
      color: colors[0],
    },
    {
      id: 'declined',
      label: 'Declined',
      value: data.declinedAmount,
      color: colors[1],
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      value: data.cancelledAmount,
      color: colors[2],
    },
    {
      id: 'pending',
      label: 'Pending',
      value: data.pendingAmount,
      color: colors[3],
    },
    {
      id: 'error',
      label: 'Error',
      value: data.errorAmount,
      color: colors[4],
    },
  ];

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[100],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[100],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[100],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary[300],
            },
          },
        }}
        colors={{ datum: "data.color" }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        arcLinkLabelsTextColor={theme.palette.secondary[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: isDashboard ? 20 : 0,
            translateY: isDashboard ? 50 : 56,
            itemsSpacing: 0,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[100],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[100]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(-75%, -170%)"
            : "translate(-50%, -100%)",
        }}
      >
        <Typography variant="h6">
          {!isDashboard && "Total:"} ${data.totalAmount}
        </Typography>
      </Box>
    </Box>
  );
};

export default BreakdownChart;

import React, { memo, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Jan",
//     new: 5,
//     total: 1,
//   },
//   {
//     name: "Feb",
//     new: 10,
//     total: 2,
//     amt: 10,
//   },
//   {
//     name: "Mar",
//     new: 5,
//     total: 4,
//   },
//   {
//     name: "Apl",
//     new: 1,
//     total: 12,
//   },
//   {
//     name: "May",
//     new: 10,
//     total: 15,
//   },
//   {
//     name: "Jun",
//     new: 3,
//     total: 20,
//   },
// ];
interface dataType {
  data: {
    name: string;
    new: number;
    total: number;
  }[];
}
const UserAreaChart = memo(({ data }: dataType) => {
  const [tickCount, setTickCount] = useState(8); // Default tick count for smaller screens

  useEffect(() => {
    function handleResize() {
      // Set tick count based on window width
      setTickCount(window.innerWidth > 768 ? 8 : 5); // Less ticks on smaller screens
      // console.log(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <ResponsiveContainer className="h-full w-1/2" width="100%" height={250}>
      <AreaChart
        className="h-[400px] w-full"
        data={data}
        margin={{
          top: 0,
          right: 30,
          left: -20,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={true}
          horizontal={false}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          // tickCount={tickCount}
          // interval="preserveStartEnd"
          tickCount={5}
          minTickGap={30}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => Math.round(value).toString()}

          // tick={(props) => {
          //   if (props.index === 0) return "";
          //   else {
          //     return props.value;
          //   }
          // }}
        />
        <Tooltip />

        {/* <Area
          type="monotone"
          dataKey="new"
          stackId="1"
          strokeWidth={3}
          stroke="#84cc16"
          // fill="#bef264"
          fill="url(#colorNew)"
        /> */}
        <Area
          type="monotone"
          dataKey="total"
          stackId="1"
          stroke="#6366f1"
          strokeWidth={3}
          // fill="#4f46e5"
          fill="url(#colorTotal)"
          isAnimationActive={true}
          animationBegin={0}
          animationDuration={1000}
        />
        <defs>
          <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#bef264" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
});

export default UserAreaChart;

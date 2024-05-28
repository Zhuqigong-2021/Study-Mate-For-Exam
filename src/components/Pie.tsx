"use client";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";
interface pieType {
  right: number;
  wrong: number;
}
const Pie = ({ right, wrong }: pieType) => {
  return (
    <PieChart
      className="h-64 w-64  rounded-full border border-gray-200 dark:border-none"
      animate={true}
      animationDuration={1500}
      data={[
        {
          title: "right",
          value: Number(right),
          color: "#86efac",
        },
        {
          title: "wrong",
          value: Number(wrong),
          color: "#f87171",
        },
      ]}
    />
  );
};

export default Pie;

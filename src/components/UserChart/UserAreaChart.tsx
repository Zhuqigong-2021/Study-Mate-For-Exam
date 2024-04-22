import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    new: 5,
    total: 1,
  },
  {
    name: "Feb",
    new: 10,
    total: 2,
    amt: 10,
  },
  {
    name: "Mar",
    new: 5,
    total: 4,
  },
  {
    name: "Apl",
    new: 1,
    total: 12,
  },
  {
    name: "May",
    new: 10,
    total: 15,
  },
  {
    name: "Jun",
    new: 3,
    total: 20,
  },
];

export default class UserAreaChart extends PureComponent {
  //   static demoUrl = "https://codesandbox.io/s/stacked-area-chart-ix341";

  render() {
    return (
      <ResponsiveContainer
        className="h-full w-1/2 "
        width={"100%"}
        height={250}
      >
        <AreaChart
          className="h-[400px] w-full"
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            // type="monotone"
            type="natural"
            dataKey="new"
            stackId="1"
            strokeWidth={3}
            stroke="#84cc16"
            fill="#bef264"
          />
          <Area
            type="monotone"
            dataKey="total"
            stackId="1"
            stroke="#fb7185"
            strokeWidth={3}
            fill="#ffe4e6"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

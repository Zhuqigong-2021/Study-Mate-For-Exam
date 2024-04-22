import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    new: 3,
    total: 1,
  },
  {
    name: "Feb",
    new: 3,
    total: 2,
    amt: 2210,
  },
  {
    name: "Mar",
    new: 5,
    total: 4,
    amt: 2290,
  },
  {
    name: "Apl",
    new: 1,
    total: 12,
    amt: 2000,
  },
  {
    name: "May",
    new: 2,
    total: 15,
    amt: 2181,
  },
  {
    name: "Jun",
    new: 3,
    total: 20,
    amt: 2500,
  },
];

export default class UserBarChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer
        width={"100%"}
        height={250}
        className="w-full md:w-1/2"
      >
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="new"
            fill="#a7f3d0"
            activeBar={<Rectangle fill="#6ee7b7" stroke="white" />}
          />
          <Bar
            dataKey="total"
            fill="#a5b4fc"
            activeBar={<Rectangle fill="#818cf8" stroke="white" />}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

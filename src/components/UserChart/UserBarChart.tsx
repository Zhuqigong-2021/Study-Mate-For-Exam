// import React, { PureComponent } from "react";
// import {
//   BarChart,
//   Bar,
//   Rectangle,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   {
//     name: "Jan",
//     new: 3,
//     total: 1,
//   },
//   {
//     name: "Feb",
//     new: 3,
//     total: 2,
//     amt: 2210,
//   },
//   {
//     name: "Mar",
//     new: 5,
//     total: 4,
//     amt: 2290,
//   },
//   {
//     name: "Apl",
//     new: 1,
//     total: 12,
//     amt: 2000,
//   },
//   {
//     name: "May",
//     new: 2,
//     total: 15,
//     amt: 2181,
//   },
//   {
//     name: "Jun",
//     new: 3,
//     total: 20,
//     amt: 2500,
//   },
// ];

// export default class UserBarChart extends PureComponent {
//   render() {
//     return (
//       <ResponsiveContainer
//         width={"100%"}
//         height={250}
//         className="w-full md:w-1/2"
//       >
//         <BarChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 0,
//             bottom: 5,
//           }}
//         >
//           {/* <CartesianGrid strokeDasharray="3 3" /> */}
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar
//             dataKey="new"
//             fill="#a7f3d0"
//             activeBar={<Rectangle fill="#6ee7b7" stroke="white" />}
//           />
//           <Bar
//             dataKey="total"
//             fill="#a5b4fc"
//             activeBar={<Rectangle fill="#818cf8" stroke="white" />}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     );
//   }
// }

import React, { memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
  CartesianGrid,
} from "recharts";

interface dataType {
  data: {
    name: string;
    new: number;
    // total: number;
  }[];
}
const UserBarChart = memo(({ data }: dataType) => {
  console.log(data);
  // Find the index of the first non-zero 'new' value
  const firstNonZeroIndex = data.findIndex((item) => item.new > 0);
  const lastNonZeroIndex = data.reduce(
    (acc, item, index) => (item.new > 0 ? index : acc),
    0,
  );
  // Slice the data from the first non-zero index
  const filteredData = data.slice(firstNonZeroIndex, lastNonZeroIndex + 1);
  return (
    <ResponsiveContainer
      width="100%"
      height={200}
      className="w-full   md:w-1/2"
    >
      <BarChart
        width={500}
        height={250}
        data={filteredData}
        margin={{
          top: 5,
          right: 30,
          left: -20,
          bottom: 0,
        }}
      >
        {/* <CartesianGrid
          // strokeDasharray="3 3"
          horizontal={false}
          vertical={false}
        /> */}
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(value) => Math.round(value).toString()}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip />
        {/* <Legend /> */}
        <Bar
          dataKey="new"
          fill="#2dd4bf"
          activeBar={<Rectangle fill="#14b8a6" stroke="white" />}
          barSize={80}
          radius={[10, 10, 10, 10]}
          // isAnimationActive={false}
          onMouseOver={(e) => {
            e.fill = "#14b8a6"; // Orange color on hover
          }}
        />
        {/* <Bar
          dataKey="total"
          fill="#a5b4fc"
          activeBar={<Rectangle fill="#818cf8" stroke="white" />}
        /> */}
      </BarChart>
    </ResponsiveContainer>
  );
});

export default UserBarChart;

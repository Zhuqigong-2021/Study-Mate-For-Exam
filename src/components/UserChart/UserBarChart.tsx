import React, { memo, useCallback, useEffect, useState } from "react";
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
import { useTheme } from "next-themes";
import { TooltipProps } from "recharts";
interface dataType {
  data: {
    name: string;
    new: number;
    // total: number;
  }[];
}

interface CustomTooltipProps extends TooltipProps<any, any> {}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    return (
      <div
        style={{
          // backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
          padding: "5px",
          border: "none",
          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
        }}
        className="bg-white dark:bg-background"
      >
        <p
          className={`text-sm ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >{`new: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
const UserBarChart = memo(({ data }: dataType) => {
  // console.log(data);
  // Find the index of the first non-zero 'new' value
  const firstNonZeroIndex = data.findIndex((item) => item.new > 0);
  const lastNonZeroIndex = data.reduce(
    (acc, item, index) => (item.new > 0 ? index : acc),
    0,
  );
  const { theme } = useTheme();
  // Slice the data from the first non-zero index
  const filteredData = data.slice(firstNonZeroIndex, lastNonZeroIndex + 1);

  const getMaxValue = useCallback(() => {
    return Math.max(...data.map((item: any) => item.value));
  }, [data]);

  const calculateTickCount = (maxValue: number) => {
    // For integers, the count will be the maximum value plus one (for zero)
    return maxValue + 1;
  };

  const [maxValue, setMaxValue] = useState(getMaxValue());
  const [tickCount, setTickCount] = useState(calculateTickCount(maxValue));

  useEffect(() => {
    const calculatedMaxValue = getMaxValue();
    if (calculatedMaxValue !== maxValue) {
      setMaxValue(calculatedMaxValue);
      setTickCount(calculateTickCount(calculatedMaxValue));
    }
  }, [data, getMaxValue, maxValue]);
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
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="15%"
              stopOpacity={0.8}
              stopColor={`${theme === "dark" ? "#4338ca" : "#4f46e5"}`}
            />
            <stop
              offset="85%"
              stopColor={`${theme === "dark" ? "#a78bfa" : "#a78bfa"}`}
              stopOpacity={0.8}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tickCount={6}
          minTickGap={20}
        />
        <YAxis
          // tickFormatter={(value) => Math.round(value).toString()}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, "dataMax"]}
          ticks={Array.from({ length: tickCount }, (_, i) => i)}
        />
        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey="new"
          // fill="#2dd4bf"
          activeBar={<Rectangle fill="#14b8a6" stroke="white" />}
          barSize={80}
          radius={[10, 10, 10, 10]}
          fill="url(#colorUv)"
          onMouseOver={(e) => {
            e.fill = "#14b8a6"; // Orange color on hover
          }}
          isAnimationActive={true}
          animationBegin={0}
          animationDuration={1000}
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

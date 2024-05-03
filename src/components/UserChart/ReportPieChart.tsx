import React, { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { TooltipProps } from "recharts";

// Define a type for the custom tooltip props, extending from TooltipProps
interface CustomTooltipProps extends TooltipProps<any, any> {}

interface RangeDictionary {
  [key: string]: number;
}
// const data = [
//   { name: "90-100", value: 25 },
//   { name: "80-90", value: 35 },
//   { name: "75-80", value: 20 },
//   { name: "0-75", value: 10 },
// ];
const COLORS = ["#6366f1", "#818cf8", "#c4b5fd", "#a78bfa"];
interface dataProps {
  width: number;
  data: {
    name: string;
    value: number;
  }[];
}

export default function ReportPieChart({ width, data }: dataProps) {
  const [activeIndex, setActiveIndex] = useState(0); // Default to the first data entry

  const onPieEnter = (_: any, index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  useEffect(() => {
    if (chartRef.current) {
      const chartBox = chartRef.current.getBoundingClientRect();
      setCenterX(chartBox.width / 2);
      setCenterY(chartBox.height / 2);
    }
  }, []);

  const CustomTooltip = ({
    active,
    payload,
    coordinate,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            position: "absolute",
            left: `${coordinate!.x}px`,
            top: `${coordinate!.y}px`,
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "5px",
            border: "1px solid #ccc",
            zIndex: 100,
          }}
        >
          <p className="flex  flex-col p-2 py-4">
            <span>{`${"scope:" + payload[0].name}`}</span>
            <span>{`${"percent:" + payload[0].value}%`}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer
      width={"100%"}
      height={200}
      className="relative flex flex-col items-center justify-center "
      ref={chartRef}
    >
      <PieChart
        className="flex w-full flex-col items-center justify-center "
        width={200}
        height={200}
      >
        <Pie
          data={data}
          cx={"50%"} // Half of the width
          cy={"50%"} // Half of the height
          innerRadius={width < 350 ? 40 : 60}
          outerRadius={width < 350 ? 60 : 80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text
          x={
            width > 350
              ? width < 385
                ? "40%"
                : width > 512
                  ? width < 715
                    ? "44%"
                    : "47%"
                  : "40%"
              : "50%"
          }
          y={width < 350 ? (width > 292 ? "45%" : "36%") : "50%"}
          //   x={centerX}
          //   y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#6366f1"
          className="text-2xl font-bold text-teal-400"
        >
          {data[activeIndex].value + "%"}
        </text>
        {width > 350 && (
          <Legend
            //   x={"0%"}
            //   y={"0%"}
            align="right"
            verticalAlign="middle"
            layout="vertical"
            iconSize={10}
          />
        )}

        {width < 350 && (
          <Legend
            //   x={"0%"}
            //   y={"0%"}
            //   align="right"
            //   verticalAlign="middle"
            //   layout="vertical"
            iconSize={10}
          />
        )}
        <Tooltip content={<CustomTooltip />} position={{ x: 10, y: 10 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

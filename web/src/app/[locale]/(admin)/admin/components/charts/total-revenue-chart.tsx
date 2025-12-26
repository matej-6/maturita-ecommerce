"use client";

import { TrendingDownIcon, TrendingUp, TrendingUpIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useMemo, useRef, useState } from "react";

export type ChartProps = {
  data90Days: {
    points: ChartData;
    trend: number;
  };
  data7Days: {
    points: ChartData;
    trend: number;
  };
  data30Days: {
    points: ChartData;
    trend: number;
  };
};

type ChartData = {
  date: string;
  revenue: string;
  label: string;
}[];

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-3)",
  },
};

export function TotalRevenueChartBar({
  data7Days,
  data90Days,
  data30Days,
}: ChartProps) {
  const [selectedData, setSelectedData] = useState<"7D" | "90D" | "30D">("90D");

  const data =
    selectedData === "90D"
      ? data90Days
      : selectedData === "30D"
      ? data30Days
      : data7Days;

  const button90DRef = useRef<HTMLButtonElement>(null);
  const button7DRef = useRef<HTMLButtonElement>(null);
  const button30DRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const button90D = button90DRef.current;
    const button7D = button7DRef.current;
    const button30D = button30DRef.current;

    if (indicator && button90D && button7D && button30D) {
      const targetButton =
        selectedData === "90D"
          ? button90D
          : selectedData === "30D"
          ? button30D
          : button7D;
      indicator.style.transform = `translateX(${targetButton.offsetLeft}px)`;
    }
  }, [selectedData]);

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-col items-stretch border-b sm:flex-row py-4!">
        <div className="flex flex-1 flex-col justify-center gap-1 sm:p-0!">
          <CardTitle>Revenue</CardTitle>
          <CardDescription className="flex gap-x-2 items-center">
            {data.trend}% Growth Last{" "}
            {selectedData === "90D"
              ? "90 Days"
              : selectedData === "30D"
              ? "30 Days"
              : "7 Days"}{" "}
            {data.trend > 0 ? (
              <TrendingUpIcon />
            ) : data.trend < 0 ? (
              <TrendingDownIcon />
            ) : null}
          </CardDescription>
        </div>
        <div className="flex gap-y-0 relative">
          <div
            ref={indicatorRef}
            className="absolute inset-0 w-[64px] h-[24px] rounded-md border-2 border-accent transition-transform duration-500 ease-in-out pointer-events-none"
          />
          <button
            ref={button90DRef}
            onClick={() => setSelectedData("90D")}
            className="text-xs text-secondary-foreground w-[64px] h-[24px]  flex items-center justify-center"
          >
            <span>90 Days</span>
          </button>
          <button
            ref={button30DRef}
            onClick={() => setSelectedData("30D")}
            className="text-xs text-secondary-foreground w-[64px] h-[24px]  flex items-center justify-center"
          >
            30 Days
          </button>
          <button
            ref={button7DRef}
            onClick={() => setSelectedData("7D")}
            className="text-xs text-secondary-foreground w-[64px] h-[24px]  flex items-center justify-center"
          >
            7 Days
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data.points}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={"revenue"}
              label={"label"}
              fill={`var(--color-chart-3)`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

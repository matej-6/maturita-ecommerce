"use client";

// https://ui.shadcn.com/charts/bar#charts

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export type Props = {
  data7Days: ChartData;
  data30Days: ChartData;
  data90Days: ChartData;
};

type ChartData = {
  slug: string;
  itemsSold: number;
  totalRevenue: number;
}[];

export function BestSellingCategoriesChart({
  data30Days,
  data7Days,
  data90Days,
}: Props) {
  const [selectedData, setSelectedData] = useState<"7D" | "90D" | "30D">("90D");

  const t = useTranslations("admin.dashboard.graphs");

  const chartConfig = {
    itemsSold: {
      label: t("bestSellingCategories.itemsSold"),
      color: "var(--chart-1)",
    },
    totalRevenue: {
      label: t("bestSellingCategories.totalRevenue"),
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

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
        <div className="flex flex-1/2 flex-col justify-center gap-1 sm:p-0!">
          <CardTitle>{t("bestSellingCategories.title")}</CardTitle>
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
            <span>{t("timePeriod.90Days")}</span>
          </button>
          <button
            ref={button30DRef}
            onClick={() => setSelectedData("30D")}
            className="text-xs text-secondary-foreground w-[64px] h-[24px]  flex items-center justify-center"
          >
            <span>{t("timePeriod.30Days")}</span>
          </button>
          <button
            ref={button7DRef}
            onClick={() => setSelectedData("7D")}
            className="text-xs text-secondary-foreground w-[64px] h-[24px]  flex items-center justify-center"
          >
            <span>{t("timePeriod.7Days")}</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="slug" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="itemsSold" fill="var(--color-itemsSold)" radius={4} />
            <Bar
              dataKey="totalRevenue"
              fill="var(--color-totalRevenue)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

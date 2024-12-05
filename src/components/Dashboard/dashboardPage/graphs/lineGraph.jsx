import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

export default function LineGraph({ data }) {
  const chartConfig = {
    appointments: {
      label: "Appointments",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="appointments"
          type="natural"
          stroke="var(--color-appointments)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-appointments)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}

import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

export default function RadialGraph({ data }) {
  const chartConfig = {
    online: {
      label: "Online",
      color: "hsl(var(--chart-1))",
    },
    walkin: {
      label: "Walk-in",
      color: "hsl(var(--chart-2))",
    },
  };

  const totalValue = Object.keys(data[0]).reduce((acc, key) => {
    acc = acc + data[0][key];
    return acc;
  }, 0);

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
      <RadialBarChart data={data} endAngle={180} innerRadius={80} outerRadius={130}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                      {totalValue.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                      Appointments
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar dataKey="online" stackId="a" cornerRadius={5} fill="var(--color-online)" className="stroke-transparent stroke-2" />
        <RadialBar dataKey="walkin" fill="var(--color-walkin)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2" />
      </RadialBarChart>
    </ChartContainer>
  );
}

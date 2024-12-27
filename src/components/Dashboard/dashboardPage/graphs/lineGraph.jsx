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

  if(!data.length){
    return <div className="h-[200px] w-full flex flex-row justify-center items-center">
      <p>No Appointment Trends found</p>
    </div>
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 8 //padding issue
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month_label" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />}/>
        <Line
          dataKey="appointment_count"
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

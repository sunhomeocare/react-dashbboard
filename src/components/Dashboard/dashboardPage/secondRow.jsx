import React from "react";
import moment from "moment";
import TrendingIcon from "./trendingIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LineGraph from "./graphs/lineGraph";

export default function SecondRow({ data }) {
  return (
    <div className="row-2 grid grid-cols-2 md:grid-cols-3 row-span-2 gap-4">
      <Card className="w-auto row-span-2 col-span-2 flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle>Appointments Trend</CardTitle>
            <CardDescription>January - March 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <LineGraph data={data.appointmentsTrend} />
          </CardContent>
        </div>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            <TrendingIcon isTrendUp={data.totalAppointments.trendingUp} />
            <p className="text-sm font-light">{data.totalAppointments.percentage}% from last month</p>
          </div>
          <div className="leading-none text-muted-foreground">Showing total appointments for the last 3 months</div>
        </CardFooter>
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="font-light">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <p className="text-3xl font-bold text-primary">23</p>
          </CardContent>
        </div>

        <CardFooter>
          <CardDescription>4 slots remaining</CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="font-light">Doctor Unavailability Count</CardTitle>
            <CardDescription>On {moment().format("Do MMMM, dddd")}</CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <p className="text-3xl font-bold text-primary">2</p>
          </CardContent>
        </div>

        <CardFooter>
          <CardDescription>Doctors on leave today</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}

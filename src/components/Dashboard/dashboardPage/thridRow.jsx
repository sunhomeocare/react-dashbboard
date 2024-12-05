import React from "react";
import TrendingIcon from "./trendingIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RadialGraph from "./graphs/radialGraph";
import DashboardDataTable from "./table/dataTable";

export default function ThirdRow({ data }) {
  return (
    <div className="row-23 grid grid-cols-2 md:grid-cols-4 row-span-2 gap-4">
      <Card className="w-auto flex flex-col">
        <CardHeader>
          <CardTitle className="font-light">Mode of Booking</CardTitle>
          <CardDescription>Online vs. Walk-in</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <RadialGraph data={data.modeOfBooking} />
        </CardContent>
        <CardFooter className="flex items-center gap-x-3">
          <TrendingIcon isTrendUp={data.totalAppointments.trendingUp} />
          <CardDescription className="text-sm font-light">{data.totalAppointments.percentage}% from last month</CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="font-light">Overall Rating</CardTitle>
            <CardDescription>User Average Ratings for Appointments</CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <p className="text-3xl font-bold text-primary">
              {data.overallRating.rating}
              <span className="text-lg font-bold text-black">/5.0</span>
            </p>
          </CardContent>
        </div>

        <CardFooter className="flex items-center gap-x-3">
          <CardDescription className="text-sm font-light">Based on {data.overallRating.noOfReviews} reviews</CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-auto row-span-1 col-span-2">
        <CardHeader>
          <CardTitle className="font-light">Upcoming Appointments</CardTitle>
          <CardDescription>Overview of upcoming appointments for the next seven days.</CardDescription>
        </CardHeader>
        <CardContent className="flex">
          <DashboardDataTable />
        </CardContent>
      </Card>
    </div>
  );
}

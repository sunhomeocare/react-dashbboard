import React from "react";
import TrendingIcon from "./trendingIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function FirstRow({ data }) {
  return (
    <div className="row-1 grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card className="w-auto flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="font-light">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <p className="text-3xl font-bold text-primary">{data.totalAppointments.value}</p>
          </CardContent>
        </div>

        <CardFooter className="flex items-center gap-x-3">
          <TrendingIcon isTrendUp={data.totalAppointments.trendingUp} />
          <CardDescription className="text-sm font-light">{data.totalAppointments.percentage}% from last month</CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="font-light">Total Registered Mobile Users</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <p className="text-3xl font-bold text-primary">{data.totalRegisteredMobileUsers.value}</p>
          </CardContent>
        </div>

        <CardFooter className="flex items-center gap-x-3">
          <TrendingIcon isTrendUp={data.totalRegisteredMobileUsers.trendingUp} />
          <CardDescription className="text-sm font-light">{data.totalRegisteredMobileUsers.percentage}% from last month</CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="font-light">Total Patient Records</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <p className="text-3xl font-bold text-primary">{data.totalPatientRecords.value}</p>
          </CardContent>
        </div>

        <CardFooter className="flex items-center gap-x-3">
          <TrendingIcon isTrendUp={data.totalPatientRecords.trendingUp} />
          <CardDescription className="text-sm font-light">{data.totalPatientRecords.percentage}% from last month</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}

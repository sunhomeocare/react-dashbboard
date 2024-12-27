import React, { useEffect, useState } from "react";
import moment from "moment";
import TrendingIcon from "./trendingIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LineGraph from "./graphs/lineGraph";
import { useGetDashboardMeticsData, useGetAppointmentTrend } from "@/lib/services/queries/getDashboardDataQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { startOfMonth } from "date-fns";

export default function SecondRow({ data }) {
  const getDashboardDataQuery = useGetDashboardMeticsData();
  const getAppointmentTrendQuery = useGetAppointmentTrend();
  const [appointmentTrendsData, setAppointmentTrendsData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (getDashboardDataQuery.isError) {
      console.error(getDashboardDataQuery.error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
    }
  }, [getDashboardDataQuery.data, getDashboardDataQuery.isError, getDashboardDataQuery.isSuccess]);

  useEffect(() => {
    if (getAppointmentTrendQuery.isError) {
      console.error(getDashboardDataQuery.error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
    } else {
      if (
        getAppointmentTrendQuery.data &&
        getAppointmentTrendQuery.data.length &&
        JSON.stringify(getAppointmentTrendQuery.data) !== JSON.stringify(appointmentTrendsData)
      ) {
        const payload_data = getPreviousSixMonths();

        setAppointmentTrendsData(payload_data);
      }
    }
  }, [getAppointmentTrendQuery.data, getAppointmentTrendQuery.isError, getAppointmentTrendQuery.isSuccess]);

  const getRemainingSlots = () => {
    const day = moment().format("dddd");
    if (day === "Sunday") {
      return Math.abs(16 - (getDashboardDataQuery.data[0]?.Today_Appointments ?? 0));
    } else {
      return Math.abs(32 - (getDashboardDataQuery.data[0]?.Today_Appointments ?? 0));
    }
  };

  const getPreviousSixMonths = () => {
    const sixMonths = Array.from({length: 6}, (_, index) => (
      moment().subtract(index+1, "months").startOf("month").format("YYYY-MM-DD")
    ));

    const updatedArray = sixMonths.map((month) => {
      const valuePresent = getAppointmentTrendQuery.data.find((backendData) => moment(month, "YYYY-MM-DD").isSame(moment(backendData.month, "YYYY-MM-DD")));

      if (!valuePresent) {
        return {
          month: moment(month, "YYYY-MM-DD").format(),
          appointment_count: 0,
          month_label: moment(month).format("MMMM")
        };
      }

      return {
        month: moment(month, "YYYY-MM-DD").format(),
        appointment_count: valuePresent.appointment_count,
        month_label: moment(month).format("MMMM")
      };
    })
    
    return updatedArray;
  }

  const getDescription = () => {
    if (!appointmentTrendsData.length) return "";

    const year = moment(appointmentTrendsData[0].month).format("YYYY");
    return `${appointmentTrendsData[0].month_label} - ${appointmentTrendsData[5].month_label} ${year}`;
  };

  return (
    <div className="row-2 grid grid-cols-2 md:grid-cols-3 row-span-2 gap-4">
      <Card className="w-auto row-span-2 col-span-2 flex flex-col justify-between">
        {getAppointmentTrendQuery.isLoading ? (
          <div className="flex-1">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <>
            <div>
              <CardHeader>
                <CardTitle>Appointments Trend</CardTitle>
                <CardDescription>{getDescription()}</CardDescription>
              </CardHeader>
              <CardContent>
                <LineGraph data={appointmentTrendsData} />
              </CardContent>
            </div>

            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                <TrendingIcon isTrendUp={data.totalAppointments.trendingUp} />
                <p className="text-sm font-light">{data.totalAppointments.percentage}% from last month</p>
              </div>
              <div className="leading-none text-muted-foreground">Showing total appointments for the last 3 months</div>
            </CardFooter>
          </>
        )}
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        {getDashboardDataQuery.isLoading ? (
          <div className="flex-1">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <>
            <div>
              <CardHeader>
                <CardTitle className="font-light">Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <p className="text-3xl font-bold text-primary">{getDashboardDataQuery.data[0]?.Today_Appointments ?? 0}</p>
              </CardContent>
            </div>

            <CardFooter>
              <CardDescription>{getRemainingSlots()} slots remaining</CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
      <Card className="w-auto flex flex-col justify-between">
        {getDashboardDataQuery.isLoading ? (
          <div className="flex-1">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <>
            <div>
              <CardHeader>
                <CardTitle className="font-light">Doctor Unavailability Count</CardTitle>
                <CardDescription>On {moment().format("Do MMMM, dddd")}</CardDescription>
              </CardHeader>
              <CardContent className="flex">
                <p className="text-3xl font-bold text-primary">{getDashboardDataQuery.data[0]?.Doctor_Unavailability ?? 0}</p>
              </CardContent>
            </div>

            <CardFooter>
              <CardDescription>Doctors on leave today</CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

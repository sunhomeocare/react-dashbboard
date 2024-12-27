import React, { useEffect, useState } from "react";
import TrendingIcon from "./trendingIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RadialGraph from "./graphs/radialGraph";
import DashboardDataTable from "./table/dataTable";
import { useGetDashboardMeticsData, useGetNextAppointmentDetails } from "@/lib/services/queries/getDashboardDataQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";

export default function ThirdRow({ data }) {
  const getDashboardDataQuery = useGetDashboardMeticsData();
  const getNextAppointmentsDataQuery = useGetNextAppointmentDetails();
  const { toast } = useToast();
  const [onlineWalkinComparisonData, setOnlineWalkinComparisonData] = useState([
    {
      online: 0,
      walkin: 0,
    },
  ]);
  const [nextAppointmentsData, setNextAppointmentsData] = useState([]);

  useEffect(() => {
    if (getDashboardDataQuery.isError) {
      console.error(getDashboardDataQuery.error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
    } else if (
      getDashboardDataQuery.data &&
      getDashboardDataQuery.data.length &&
      JSON.stringify(getDashboardDataQuery.data) !== JSON.stringify(onlineWalkinComparisonData)
    ) {
      setOnlineWalkinComparisonData([
        {
          online: getDashboardDataQuery.data[0]?.Online_Mode_Count ?? 0,
          walkin: getDashboardDataQuery.data[0]?.Walkin_Count ?? 0,
        },
      ]);
    }
  }, [getDashboardDataQuery.data, getDashboardDataQuery.isError, getDashboardDataQuery.isSuccess]);

  useEffect(() => {
    if (getNextAppointmentsDataQuery.isError) {
      console.error(getNextAppointmentsDataQuery.error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
    } else if (getNextAppointmentsDataQuery.data && getNextAppointmentsDataQuery.data.length) {
      const calculatedData = getNextSevenDays();
      if (JSON.stringify(calculatedData) !== JSON.stringify(nextAppointmentsData)) {
        setNextAppointmentsData(calculatedData);
      }
    }
  }, [getNextAppointmentsDataQuery.data, getNextAppointmentsDataQuery.isError, getNextAppointmentsDataQuery.isSuccess]);

  const getNextSevenDays = () => {
    const sevenDays = Array.from({ length: 7 }, (_, index) =>
      moment()
        .add(index + 1, "days")
        .format("YYYY-MM-DD")
    );

    const updatedArray = sevenDays.map((day) => {
      const valuePresent = getNextAppointmentsDataQuery.data.find((backendData) => moment(day, "YYYY-MM-DD").isSame(moment(backendData.date, "YYYY-MM-DD")));

      if (!valuePresent) {
        return {
          date: moment(day, "YYYY-MM-DD").format(),
          noOfAppointments: 0,
          doctorUnavailbility: 0,
        };
      }

      return {
        date: moment(day, "YYYY-MM-DD").format(),
        noOfAppointments: valuePresent.appointment_count,
        doctorUnavailbility: valuePresent.doc_unavailability_count,
      };
    });

    return updatedArray;
  };

  return (
    <div className="row-23 grid grid-cols-2 md:grid-cols-4 row-span-2 gap-4">
      <Card className="w-auto flex flex-col">
        {getDashboardDataQuery.isLoading ? (
          <div className="flex-1">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="font-light">Mode of Booking</CardTitle>
              <CardDescription>Online vs. Walk-in</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
              <RadialGraph data={onlineWalkinComparisonData} />
            </CardContent>
            <CardFooter className="flex items-center gap-x-3">
              <TrendingIcon isTrendUp={data.totalAppointments.trendingUp} />
              <CardDescription className="text-sm font-light">{data.totalAppointments.percentage}% from last month</CardDescription>
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
                <CardTitle className="font-light">Overall Rating</CardTitle>
                <CardDescription>User Average Ratings for Appointments</CardDescription>
              </CardHeader>
              <CardContent className="flex">
                <p className="text-3xl font-bold text-primary">
                  {getDashboardDataQuery.data[0]?.Overall_Rating ?? 0}
                  <span className="text-lg font-bold text-black">/5.0</span>
                </p>
              </CardContent>
            </div>

            <CardFooter className="flex items-center gap-x-3">
              <CardDescription className="text-sm font-light">Based on {getDashboardDataQuery.data[0]?.Number_of_ratings ?? 0} reviews</CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
      <Card className="w-auto row-span-1 col-span-2">
        {getNextAppointmentsDataQuery.isLoading ? (
          <div className="flex-1">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="font-light">Upcoming Appointments</CardTitle>
              <CardDescription>Overview of upcoming appointments for the next seven days.</CardDescription>
            </CardHeader>
            <CardContent className="flex">
              <DashboardDataTable data={nextAppointmentsData} />
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

import React, { useEffect } from "react";
import TrendingIcon from "./trendingIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardMeticsData } from "@/lib/services/queries/getDashboardDataQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function FirstRow({ data }) {
  const getDashboardDataQuery = useGetDashboardMeticsData();
  const { toast } = useToast();

  useEffect(() => {
    if(getDashboardDataQuery.isError){
      console.error(getDashboardDataQuery.error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
    }
  }, [getDashboardDataQuery.data, getDashboardDataQuery.isError, getDashboardDataQuery.isSuccess])

  return (
    <div className="row-1 grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card className="w-auto flex flex-col justify-between">
        {getDashboardDataQuery.isLoading ? (
          <div className="flex-1">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <>
            <div>
              <CardHeader>
                <CardTitle className="font-light">Total Appointments</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <p className="text-3xl font-bold text-primary">{getDashboardDataQuery.data[0]?.Total_Appointments ?? 0}</p>
              </CardContent>
            </div>
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
                <CardTitle className="font-light">Total Registered Mobile Users</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <p className="text-3xl font-bold text-primary">{getDashboardDataQuery.data[0]?.Total_Users ?? 0}</p>
              </CardContent>
            </div>

            <CardFooter className="flex items-center gap-x-3">
              <TrendingIcon isTrendUp={data.totalRegisteredMobileUsers.trendingUp} />
              <CardDescription className="text-sm font-light">{data.totalRegisteredMobileUsers.percentage}% from last month</CardDescription>
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
                <CardTitle className="font-light">Total Patient Records</CardTitle>
              </CardHeader>
              <CardContent className="flex">
                <p className="text-3xl font-bold text-primary">{getDashboardDataQuery.data[0]?.Total_Patients ?? 0}</p>
              </CardContent>
            </div>

            <CardFooter className="flex items-center gap-x-3">
              <TrendingIcon isTrendUp={data.totalPatientRecords.trendingUp} />
              <CardDescription className="text-sm font-light">{data.totalPatientRecords.percentage}% from last month</CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

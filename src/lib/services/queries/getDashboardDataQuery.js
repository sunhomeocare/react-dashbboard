import { useQuery } from "@tanstack/react-query";
import { getMetricsData, getAppointmentTrend, getNextAppointmentsCounts } from "../api/getDashboardData";

export const useGetDashboardMeticsData = () => {
  return useQuery({
    queryKey: ["getMetricsData"],
    queryFn: getMetricsData,
    retry: 3,
    retryDelay: 3000,
  });
};

export const useGetAppointmentTrend = () => {
    return useQuery({
        queryKey: ["getAppointmentTrend"],
        queryFn: getAppointmentTrend,
        retry: 3,
        retryDelay: 3000,
      });
}

export const useGetNextAppointmentDetails = () => {
    return useQuery({
        queryKey: ["getNextAppointmentsCounts"],
        queryFn: getNextAppointmentsCounts,
        retry: 3,
        retryDelay: 3000,
      });
}

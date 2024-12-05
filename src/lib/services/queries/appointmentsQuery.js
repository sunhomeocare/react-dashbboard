import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../api/getAppointments";
import { getAppointmentRatings } from "../api/appointmentRatings";

export const useGetAppointments = () => {
  return useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
    retry: 3,
    retryDelay: 3000,
  });
};

export const useGetAppointmentRatingsQuery = () => {
  return useQuery({
    queryKey: ["getAppointmentsRatings"],
    queryFn: getAppointmentRatings,
    retry: 3,
    retryDelay: 3000,
  });
}
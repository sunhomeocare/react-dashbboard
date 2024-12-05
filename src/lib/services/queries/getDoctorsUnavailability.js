import { useQuery } from "@tanstack/react-query";
import { getDoctorsUnavailability } from "../api/getDoctorsUnavailability";

export const useGetDoctorsUnavailability = () => {
  return useQuery({
    queryKey: ["getAllDoctorsUnavailability"],
    queryFn: getDoctorsUnavailability,
    retry: 3,
    retryDelay: 3000,
  });
};

import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../api/getDoctors";

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ["getAllDoctors"],
    queryFn: getDoctors,
    retry: 3,
    retryDelay: 3000,
  });
};

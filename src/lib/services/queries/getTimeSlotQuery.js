import { useQuery } from "@tanstack/react-query";
import { getTimeSlots } from "../api/getTimeSlot";

export const useGetTimeSlots = (day = "", dayType = 0) => {
  return useQuery({
    queryKey: ["getTimeSlots", day, dayType],
    queryFn: () => getTimeSlots(day, dayType),
    retry: 3,
    retryDelay: 3000,
    enabled: !!dayType
  });
};


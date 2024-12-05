import { useQuery } from "@tanstack/react-query";
import { getDashboardUsers } from "../api/manageDashboardUsers";

export const useGetDashboardUsersQuery = () => {
  return useQuery({
    queryKey: ["getDashboardUsers"],
    queryFn: getDashboardUsers,
    retry: 3,
    retryDelay: 3000,
  });
};

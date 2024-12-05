import { useQuery } from "@tanstack/react-query";
import { getNews } from "../api/getNews";

export const useGetNews = () => {
  return useQuery({
    queryKey: ["getNews"],
    queryFn: getNews,
    retry: 3,
    retryDelay: 3000,
  });
};

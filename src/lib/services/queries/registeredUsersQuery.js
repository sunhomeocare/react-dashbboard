import { useQuery } from "@tanstack/react-query";
import { getRegisteredUsers, getRegisteredUser } from "../api/registeredUsers";

export const useGetRegisteredUsers = () => {
  return useQuery({
    queryKey: ["getRegisteredUsers"],
    queryFn: getRegisteredUsers,
    retry: 3,
    retryDelay: 3000,
  });
};

export const useGetRegisteredUser = (phoneNumber = "") => {
  return useQuery({
    queryKey: ["getRegisteredUser", phoneNumber],
    queryFn: () => getRegisteredUser(phoneNumber),
    retry: 3,
    retryDelay: 3000,
    enabled: !!phoneNumber
  });
}

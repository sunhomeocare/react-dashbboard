import { useQuery } from "@tanstack/react-query";
import { getPatientDetails, getPatientDetailForPhonenumber } from "../api/patientDetails";

export const useGetPatientDetails = () => {
  return useQuery({
    queryKey: ["getPatientDetails"],
    queryFn: getPatientDetails,
    retry: 3,
    retryDelay: 3000,
  });
};

export const useGetPatientDetail = (phoneNumber = "") => {
  return useQuery({
    queryKey: ["getPatientDetail", phoneNumber],
    queryFn: () => getPatientDetailForPhonenumber(phoneNumber),
    retry: 1,
    retryDelay: 3000,
    enabled: phoneNumber.length === 10
  });
}

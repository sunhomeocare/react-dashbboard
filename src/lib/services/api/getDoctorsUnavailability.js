import { supabase } from "@/lib/supabase";

export const getDoctorsUnavailability = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("doctor_unavailability").select(`id, date, created_at, doctor_details (id, name, branch)`);
      if (result.error) {
        reject(result.error);
      }
      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};

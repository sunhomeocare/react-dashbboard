import { supabase } from "@/lib/supabase";

export const getAppointments = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("appointments").select(`id, date, reason, status, created_at, updated_at, doctor_details (id, name, branch), time_slots (id, display_text), patient_details (id, name, Users!inner (id, phoneNumber))`);
      if (result.error) {
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};

import { supabase } from "@/lib/supabase";

export const getAppointmentRatings = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("appointment_ratings").select(`id, rating, review, created_at, appointments!inner (id, doctor_details!inner (id, name), date, time_slots!inner (id, display_text), patient_details!inner ( Users!inner (id, displayName, phoneNumber)))`);
      if (result.error) {
        reject(result.error);
      }

      console.error(result.data);
      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};

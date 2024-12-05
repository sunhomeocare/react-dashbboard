import { supabase } from "@/lib/supabase";

export const getDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("doctor_details").select();
      if (result.error) {
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};

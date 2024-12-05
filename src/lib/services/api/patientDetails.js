import { supabase } from "@/lib/supabase";

export const getPatientDetails = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("patient_details").select(`id, name, age, gender, phoneNumber, address, Users ( id, displayName, phoneNumber )`);
      if (result.error) {
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getPatientDetailForPhonenumber = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("patient_details").select(`id, name, Users!inner ( id, phoneNumber )`).eq("Users.phoneNumber", phoneNumber);

      if (result.error) {
        console.error(result.error);
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}

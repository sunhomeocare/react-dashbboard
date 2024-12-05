import { supabase } from "@/lib/supabase";

export const getRegisteredUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("Users").select();
      if (result.error) {
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};


export const getRegisteredUser = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("Users").select(`id, displayName, phoneNumber`).like("phoneNumber", `%${phoneNumber}%`).limit(10);
      if (result.error) {
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}
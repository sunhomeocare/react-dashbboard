import { supabase } from "@/lib/supabase";

export const getDashboardUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("dashboard_users").select();
      if (result.error) {
        reject(result.error);
      }

      //here returning the result by removing the adminRoot credentials. 
      resolve(result.data.filter((du) => du.username !== "adminRoot"));

    } catch (error) {
      reject(error);
    }
  });
};

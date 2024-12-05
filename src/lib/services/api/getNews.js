import { supabase } from "@/lib/supabase";

export const getNews = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.from("news").select();
      if (result.error) {
        reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
};

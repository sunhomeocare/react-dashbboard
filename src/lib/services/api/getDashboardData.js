import { supabase } from "@/lib/supabase";
import moment from "moment";

export const getMetricsData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = moment().format("YYYY-MM-DD");
      const result = await supabase.from("Metrics").select().eq("Date", today).order("created_at", {
        ascending: false,
      });

      if (result.error) {
        return reject(result.error);
      }

      resolve(result.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getAppointmentTrend = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await supabase.rpc("get_appointments_trend");

      if (result.error) {
        return reject(result.error);
      }
      
      resolve(result.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getNextAppointmentsCounts = () => {
    return new Promise(async (resolve, reject) => {
        try {
          const result = await supabase.rpc("get_next_appointments_data");
    
          if (result.error) {
            return reject(result.error);
          }
    
          console.error(result.data);
          resolve(result.data);
        } catch (error) {
          return reject(error);
        }
      });
}

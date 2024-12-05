import { supabase } from "@/lib/supabase";

export const getTimeSlots = (date, dayType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result1 = await supabase.from("time_slots").select().eq("day_type", dayType);

      if (result1.error) {
        return reject(result1.error);
      }

      const result2 = await supabase.from("time_slots").select(`*, appointments!inner ()`).eq("appointments.date", date);

      if (result2.error) {
        return reject(result2.error);
      }

      if (!result2.data.length) {
        //no slot is booked so show all the dates.
        return resolve(
          result1.data.map((slot) => {
            return {
              ...slot,
              disabled: false,
            };
          })
        );
      }

      return resolve(result1.data.map((originalSlot)=> ({
        ...originalSlot,
        disabled: result2.data.some(bookedSlot => bookedSlot.id === originalSlot.id)
      })));

    } catch (error) {
      return reject(error);
    }
  });
};

import { supabase } from "../supabase";

export const createUnavail = async (data) => {
    try {
        if (!data || !Object.keys(data).length) {
            return { status: false, code: 1, message: "Required Data not provided." };
          }

          const response = await supabase.from("doctor_unavailability").insert([
            {
                doctor_id: data.doctorId,
                date: data.unavailDate
            }
          ]);

          if (response.error) {
            if (response.error.code === "23505") {
              //doctor with same name is already present
              return { status: false, code: 2, message: "Unavailability with same id is already present." };
            }
      
            return { status: false, code: 3, message: response.error.details };
          }

          if (response.status === 201) {
            return { status: true };
          } else {
            return { status: false, code: 4, message: response.error.details };
          }

    } catch (error) {
        return { status: false, code: 5, message: error.message };
    }
}

export const isDoctorAvail = async (id, date) => {
  //input - doctor id, date
  //output - { status: true, isAvail: boolean}, true - doctor avail. false - doctor unavail. 

  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("doctor_unavailability").select(`id`).eq("doctor_id", id).eq("date", date);

    if (response.error) {
      return { status: false, code: 2, message: response.error.details };
    }

    return { status: true, isAvail: response.data.length === 0 };
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
}

export const deleteDoctorUnavail = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("doctor_unavailability").delete().eq("id", id);

    if (response.error) {
      return { status: false, code: 2, message: response.error.message };
    }

    if (response.status === 204) {
      return { status: true };
    }
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};
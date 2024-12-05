import { appointmentStatus } from "../constants";
import { supabase } from "../supabase";

export const createAppointment = async (data) => {
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("appointments").insert([
      {
        doctor_id: data.doctorId,
        patient_id: data.user_id,
        slot_id: data.time_slot,
        date: data.dateOfAppointment,
        reason: data.reasonForVisit,
        status: appointmentStatus.scheduled,
        is_online_mode: false
      },
    ]);

    if (response.error) {
      if (response.error.code === "23505") {
        return { status: false, code: 2, message: "Appointment for the same user and same date and slot is already present" };
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
};

export const updateAppointment = async (id, data) => {
  //here the data will be a object with all the keys value pairs where the data is updated by the user.
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("appointments").update(data).eq("id", id);

    if (response.error) {
      console.error(response);
      return { status: false, code: 2, message: response.error.details };
    }

    if (response.status === 204) {
      return { status: true };
    } else {
      return { status: false, code: 3, message: response.error.details };
    }
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};

export const deleteAppointment = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("appointments").delete().eq("id", id);

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

export const updateAppointmentStatus = async (id, status) => {
  try {
    if (!status) return { status: false, code: 1, message: "status isn't provided." };

    const response = await supabase.from("appointments").update({ "status": status }).eq("id", id);

    if (response.error) {
      return { status: false, code: 2, message: response.error.details };
    }

    if (response.status === 204) {
      return { status: true };
    } else {
      return { status: false, code: 3, message: response.error.details };
    }
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};
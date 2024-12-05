import { supabase } from "../supabase";

export const getDoctorsForDropdown = async () => {
  try {
    const { data, error } = await supabase.from("doctor_details").select(`id, name`);

    if (error) {
      return { status: false, code: 2, message: error.details };
    }

    return { status: true, data };
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};

export const createDoctor = async (data) => {
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("doctor_details").insert([
      {
        name: data.name,
        designation: data.designation,
        branch: data.branch,
        experience: data.experience,
        available_time: data.available_time,
        available_date: data.available_date,
      },
    ]);

    if (response.error) {
      if (response.error.code === "23505") {
        //doctor with same name is already present
        return { status: false, code: 2, message: "Doctor with same name is already present." };
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

export const updateDoctor = async (id, data) => {
  //here the data will be a object with all the keys value pairs where the data is updated by the user.
  try {
    if (!id || !data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("doctor_details").update(data).eq("id", id);

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

export const deleteDoctor = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("doctor_details").delete().eq("id", id);

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

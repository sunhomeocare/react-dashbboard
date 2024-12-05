import { supabase } from "../supabase";

export const createRegisteredUser = async (data) => {
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("Users").insert([
      {
        displayName: data.name,
        phoneNumber: data.phoneNumber,
        age: data.age,
        gender: data.gender,
      },
    ]);

    if (response.error) {
      if (response.error.code === "23505") {
        //doctor with same name is already present
        return { status: false, code: 2, message: "User with same phone number is already present." };
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

export const updateRegisteredUser = async (id, data) => {
  //here the data will be a object with all the keys value pairs where the data is updated by the user.
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("Users").update(data).eq("id", id);

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

export const deleteRegisteredUser = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("Users").delete().eq("id", id);

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
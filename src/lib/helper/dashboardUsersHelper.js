import { supabase } from "../supabase";
import bcrypt from "bcryptjs";

export const isValidUser = async (username, password) => {
  try {
    if (!username || !password) return { status: false, code: 1, message: "Username or Password not provided." };

    const { data, error } = await supabase.from("dashboard_users").select().eq("username", username);

    if (error) {
      return { status: false, code: 2, message: error.toString() };
    }

    if (!data.length) {
      return { status: false, code: 5, message: "No user found" };
    }

    const match = await bcrypt.compare(password, data[0].password_hash);

    if (!match) {
      return { status: false, code: 3, message: "Invalid Credentials" };
    }

    //this is the successful login case.
    return { status: true };
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};

export const getUser = async (username) => {
  try {
    if (!username) return { status: false, code: 1, message: "Username not provided." };

    const { data, error } = await supabase.from("dashboard_users").select().eq("username", username);

    if (error) {
      return { status: false, code: 2, message: error.details };
    }

    if (!data.length) {
      return { status: false, code: 5, message: "No user found" };
    }

    return { status: true, data };
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};

export const createUser = async (username, password, role) => {
  try {
    if (!username || !password || !role) return { status: false, code: 1, message: "Username or Password not provided." };

    const passwordHash = await bcrypt.hash(password, 10);

    const response = await supabase.from("dashboard_users").insert([
      {
        username: username,
        password_hash: passwordHash,
        role: role,
      },
    ]);

    if (response.error) {
      if (response.error.code === "23505") {
        //username is already taken
        return { status: false, code: 2, message: "Username already present" };
      }

      return { status: false, code: 3, message: response.error.details };
    }

    if (response.status === 201) {
      return { status: true };
    }
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("dashboard_users").delete().eq("id", id);

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

export const makeAdmin = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    const response = await supabase.from("dashboard_users").update({ role: "admin" }).eq("id", id);

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

const validateReqData = (data) => {
  if (!data) return false;
  const requiredKeys = ["id", "username", "role"];
  const value = Object.keys(data).every((dataKey) => requiredKeys.includes(dataKey));
  return value;
};

export const getJWTtoken = async (userDetails) => {
  if (!validateReqData(userDetails)) {
    return { status: false, code: 1, message: "Invalid data provided" };
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_PROD_EDGE_FUNCTION}/functions/v1/generate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_PROD_ANON_KEY}`,
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      return { status: false, code: 2, response_status: response.status, message: response.statusText };
    }

    const data = await response.json();
    //console.error("data", data);

    return { status: true, data: data };
  } catch (error) {
    return { status: false, code: 3, message: error.message };
  }
};

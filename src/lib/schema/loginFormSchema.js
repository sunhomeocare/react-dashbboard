import { z } from "zod";

const loginFormSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Invalid Username. Username must be between 6 and 15 characters long."
    }).min(6).max(15),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Invalid Password. Password must be atleast 8 characters long."
    }).min(8)
});

export default loginFormSchema;
import { z } from "zod";

const registerFormSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Invalid Username. Username must be between 6 and 15 characters long."
    }).min(6).max(15),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Invalid Password. Password must be atleast 8 characters long."
    }).min(8),
    role: z.string().min(1, "Please select a role")
});

export default registerFormSchema;
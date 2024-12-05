import { z } from "zod";

const doctorRegisterFormSchema = z.object({
    name: z.string({
        required_error: "Doctor name is required",
        invalid_type_error: "Invalid Username. Username must be between 6 and 15 characters long."
    }).min(6),
    designation: z.string({
        required_error: "Password is required",
        invalid_type_error: "Invalid Password. Password must be atleast 8 characters long."
    }).min(6),
    branch: z.string().min(1, "Please select a role"),
    experience: z.string()
    .transform((val) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        throw new Error('Invalid number');
      }
      return parsed;
    }).pipe(
        z.number()
          .int()
          .positive()
          .max(100, "Experience cannot be more than 100 years")
      ),
    available_time: z.string().min(3),
    available_date: z.string().min(3)
});

export default doctorRegisterFormSchema;
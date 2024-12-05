import { z } from "zod";

const patientFormSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Invalid Name. Name must be atleast 6 characters long."
    }).min(6),
    age: z.string()
    .transform((val) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        throw new Error('Invalid number');
      }
      return parsed;
    }).pipe(
        z.number()
          .int()
          .min(0)
          .max(100, "Age cannot be more than 100 years")
      ),
    gender: z.string().min(1, "Please select a Gender"),
    phoneNumber: z.string({
        required_error: "Phonenumber is required",
        invalid_type_error: "Invalid Phone number."
    }).length(10).regex(/^[6-9]\d{9}$/),
    address: z.string().min(15).max(255),
    user_id: z.number().transform((value) => {
      if(value === 0) return "";
      return value.toString();
    }).pipe(
      z.string().min(1, "Atleast a patient should be selected")
    )
});

export default patientFormSchema;
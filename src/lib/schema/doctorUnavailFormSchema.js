import { z } from "zod";

const doctorUnavailFormSchema = z.object({
  doctorId: z
    .string()
    .transform((value) => {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {
        throw new Error("Invalid number");
      }

      return parsed;
    })
    .pipe(z.number().positive("Atleast one doctor should be selected")),
  unavailDate: z.date({
    required_error: "A date of unavailability is required.",
    invalid_type_error: "Required"
  })
});

export default doctorUnavailFormSchema;

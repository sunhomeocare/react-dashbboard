import { z } from "zod";

const appointmentRegisterFormSchema = z.object({
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
  dateOfAppointment: z.date({
    required_error: "select a date for appointment",
    invalid_type_error: "Required",
  }),
  user_id: z
    .number()
    .transform((value) => {
      if (value === 0) return "";
      return value.toString();
    })
    .pipe(z.string().min(1, "Atleast one patient should be selected")),
  time_slot: z
    .string()
    .transform((value) => {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {
        throw new Error("Invalid number");
      }

      return parsed;
    })
    .pipe(z.number().positive("Atleast one time slot should be selected")),
  reasonForVisit: z.string().min(8, "Reason for the appointment should be provided"),
});

export default appointmentRegisterFormSchema;

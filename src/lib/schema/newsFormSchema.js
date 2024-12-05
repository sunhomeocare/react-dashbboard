import { z } from "zod";

const MAX_FILE_SIZE = 300000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const newsFormSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(10),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(255),
  image: z
    .any()
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 300KB.`),
});

export default newsFormSchema;

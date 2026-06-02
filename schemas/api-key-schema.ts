import * as yup from "yup"

export const apiKeySchema = yup.object({
  name: yup.string().trim().required("Key name is required"),
  websiteUrl: yup
    .string()
    .trim()
    .url("Enter a valid URL (https://…)")
    .required("Website URL is required"),
})

export type ApiKeyFormValues = yup.InferType<typeof apiKeySchema>

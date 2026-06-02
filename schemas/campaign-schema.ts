import * as yup from "yup"

import { AD_FORMATS } from "@/lib/ad-formats"
import { AUDIENCE_IDS, BUDGET_MAX, BUDGET_MIN, INTEREST_IDS } from "@/lib/targeting"

const FORMAT_IDS = AD_FORMATS.map((format) => format.id)

export const campaignSchema = yup.object({
  name: yup.string().trim().required("Ad name is required"),
  format: yup
    .string()
    .oneOf(FORMAT_IDS, "Choose an ad type")
    .required("Ad type is required"),
  description: yup
    .string()
    .trim()
    .min(10, "Add at least 10 characters")
    .required("Description is required"),
  imageUrl: yup
    .string()
    .trim()
    .url("Enter a valid image URL (https://…)")
    .required("Image URL is required"),
  budget: yup
    .number()
    .typeError("Set a budget")
    .min(BUDGET_MIN)
    .max(BUDGET_MAX)
    .required(),
  audiences: yup
    .array()
    .of(yup.string().oneOf(AUDIENCE_IDS).required())
    .min(1, "Select at least one target audience")
    .required(),
  interests: yup
    .array()
    .of(yup.string().oneOf(INTEREST_IDS).required())
    .min(1, "Select at least one interest")
    .required(),
})

export type CampaignFormValues = yup.InferType<typeof campaignSchema>

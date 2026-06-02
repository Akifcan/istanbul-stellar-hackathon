import * as yup from "yup"

import { CAMPAIGN_STATUS } from "@/lib/campaigns"

export const campaignEditSchema = yup.object({
  name: yup.string().trim().required("Ad name is required"),
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
  status: yup
    .string()
    .oneOf([CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.PAUSED])
    .required(),
})

export type CampaignEditFormValues = yup.InferType<typeof campaignEditSchema>

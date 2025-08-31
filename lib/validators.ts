import { z } from 'zod'

export const profileFormSchema = z.object({
  bio: z
    .string()
    .min(10, { message: 'Bio must be at least 10 characters long.' })
    .max(160, { message: 'Bio must not be longer than 160 characters.' }),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

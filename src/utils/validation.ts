import {z} from 'zod'

const MAX_NAME_LENGTH = 50
const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 15
const MAX_FEEDBACK_MESSAGE_LENGTH = 200

const validNamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\-']+$/
const startsWithAlphanumericPattern = /^[a-zA-Z0-9]/
const endsWithAlphanumericPattern = /[a-zA-Z0-9]$/
const alphanumericUnderscoreHyphenPattern = /^[a-zA-Z0-9_-]+$/

function isValidNamePattern(val: string): boolean {
  return validNamePattern.test(val)
}

function usernameSuperRefine(val: string, ctx: z.RefinementCtx) {
  if (!startsWithAlphanumericPattern.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: 'regex',
      message: 'Must start with a letter or number',
    })
  }

  if (!endsWithAlphanumericPattern.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: 'regex',
      message: 'Must end with a letter or number',
    })
  }

  if (!alphanumericUnderscoreHyphenPattern.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: 'regex',
      message:
        'May only contain letters, numbers, underscores (_), and hyphens (-) ',
    })
  }
}

const usernameBaseSchema = z
  .string()
  .min(MIN_USERNAME_LENGTH)
  .max(MAX_USERNAME_LENGTH)
  .superRefine(usernameSuperRefine)
const emailBaseSchema = z.string().email()
const nameBaseSchema = z
  .string()
  .max(MAX_NAME_LENGTH)
  .refine(isValidNamePattern, {
    message:
      'May only contain alphabetical characters, hyphens, apostrophes, and accented characters',
  })

export const signupInputSchema = z.object({
  username: usernameBaseSchema,
  password: usernameBaseSchema,
  email: emailBaseSchema.optional(),
  firstName: nameBaseSchema.optional(),
  lastName: nameBaseSchema.optional(),
})

export const myUserUpdateSchema = z.object({
  username: usernameBaseSchema.optional(),
  email: emailBaseSchema.optional(),
  firstName: nameBaseSchema.optional().nullable(),
  lastName: nameBaseSchema.optional().nullable(),
})

export const feedbackInputSchema = z.object({
  message: z.string().max(MAX_FEEDBACK_MESSAGE_LENGTH),
})

import { builder } from '../../builder'
import { feedbackInputSchema } from '../../utils/validation'

export const FeedbackInput = builder.inputType('FeedbackInput', {
  validate: { schema: feedbackInputSchema },
  fields: (t) => ({
    message: t.string({ required: true }),
  }),
})

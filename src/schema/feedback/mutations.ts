import { Feedback } from '.'
import { builder } from '../../builder'
import { sendFeedback } from '../../utils/slack'
import { FeedbackInput } from './inputs'

builder.mutationFields((t) => ({
  sendFeedback: t.field({
    type: Feedback,
    args: {
      input: t.arg({
        type: FeedbackInput,
        required: true,
      }),
    },
    resolve: async (_parent, args, context) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const formattedMessage = `*${context.user.id}*: ${args.input.message}`

      try {
        const text = await sendFeedback({ text: formattedMessage });
        return { message: text };
      } catch (err) {
        console.error(err);
        throw new Error(`Error sending feedback`);
      }
    },
  }),
}));

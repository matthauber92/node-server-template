import { builder } from '../../builder'

interface Feedback {
  message?: string
}
export const Feedback = builder.objectRef<Feedback>('Feedback').implement({
  fields: (t) => ({
    message: t.exposeString('message', { nullable: true }),
  }),
})

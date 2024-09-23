import {builder} from '../../builder'

interface IFeedback {
  message?: string
}

export const Feedback = builder.objectRef<IFeedback>('Feedback').implement({
  fields: (t) => ({
    message: t.exposeString('message', {nullable: true}),
  }),
})

import {builder} from '../../builder'

builder.prismaObject('User', {
  authScopes: () => ({
    loggedIn: true
  }),
  fields: (t) => ({
    id: t.exposeString('id'),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'DateTime',
    }),
    // NOTE: must be querying registered users. if this changes, make username nullable
    username: t.string({
      resolve: (user) => user.username,
    }),
    email: t.string({
      resolve: (user) => user.email,
    }),
    password: t.string({
      resolve: (user) => user.password,
    }),
    firstName: t.string({
      nullable: true,
      unauthorizedResolver: () => null,
      resolve: (user) => user.firstName,
    }),
    lastName: t.string({
      nullable: true,
      unauthorizedResolver: () => null,
      resolve: (user) => user.lastName,
    }),
  }),
})

interface IAuthentication {
  token: string
  userId?: string
}

// NOTE: to use as string (e.g. type: 'Authentication'), must use the Objects property
// in SchemaBuilder intializer, top level. in other words, at least the interface
// would need to be imported there and applied
export const Authentication = builder
  .objectRef<IAuthentication>('Authentication')
  .implement({
    fields: (t) => ({
      token: t.exposeString('token'),
      userId: t.exposeString('userId', {nullable: true}),
    }),
  })

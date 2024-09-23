import {builder} from '../../builder'
import {myUserUpdateSchema, signupInputSchema} from '../../utils/validation'
import {SortOrder, StringFilter, IStringFilter} from '../generic'

export const UserWhere = builder.inputType('UserWhere', {
  fields: (t) => ({
    id: t.string(),
  }),
})

export interface IUserFilter {
  id?: IStringFilter
  AND?: IUserFilter
  NOT?: IUserFilter
  OR?: IUserFilter
}

export const UserFilter = builder.inputRef<IUserFilter>('UserFilter').implement({
  fields: (t) => ({
    id: t.field({type: StringFilter}),

    AND: t.field({type: UserFilter}),
    NOT: t.field({type: UserFilter}),
    OR: t.field({type: UserFilter}),
  }),
})

export const UserListFilter = builder.inputType('UserListFilter', {
  fields: (t) => ({
    every: t.field({type: UserFilter}),
    none: t.field({type: UserFilter}),
    some: t.field({type: UserFilter}),
  }),
})

export const UserOrderBy = builder.inputType('UserOrderBy', {
  fields: (t) => ({
    id: t.field({type: SortOrder}),
  }),
})

export const MyUserUpdate = builder.inputType('MyUserUpdate', {
  validate: {
    schema: myUserUpdateSchema,
  },
  fields: (t) => ({
    username: t.string(),
    email: t.string(),
    firstName: t.string(),
    lastName: t.string(),
  }),
})

// TODO: only ask for required inputs on signup. use progressive profiling
export const SignupInput = builder.inputType('SignupInput', {
  validate: {schema: signupInputSchema},
  fields: (t) => ({
    username: t.string({required: true}),
    email: t.string(),
    firstName: t.string(),
    lastName: t.string(),
    password: t.string({required: true}),
  }),
})

export const AuthenticateInput = builder.inputType('AuthenticateInput', {
  fields: (t) => ({
    username: t.string({required: true}),
    password: t.string({required: true}),
  }),
})

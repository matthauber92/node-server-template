import { builder } from '../builder'

const sortOrders = ['asc', 'desc'] as const

type SortOrder = (typeof sortOrders)[number]

const queryModes = ['default', 'insensitive'] as const

type QueryMode = (typeof queryModes)[number]

export const SortOrder = builder.enumType('SortOrder', {
  values: sortOrders,
})
export const QueryMode = builder.enumType('QueryMode', {
  values: queryModes,
})

export interface StringFilter {
  contains?: string
  startsWith?: string
  endsWith?: string
  equals?: string
  gt?: string
  gte?: string
  lt?: string
  lte?: string
  in?: string[]
  notIn?: string[]
  mode?: QueryMode
  not?: StringFilter
}

// must use inputRef passing interface to generic for rucursive inputs
export const StringFilter = builder
  .inputRef<StringFilter>('StringFilter')
  .implement({
    fields: (t) => ({
      contains: t.string(),
      startsWith: t.string(),
      endsWith: t.string(),

      equals: t.string(),
      gt: t.string(),
      gte: t.string(),
      lt: t.string(),
      lte: t.string(),

      in: t.field({ type: ['String'] }),
      notIn: t.field({ type: ['String'] }),

      mode: t.field({ type: QueryMode }),

      not: t.field({
        type: StringFilter,
      }),
    }),
  })

export const StringListFilter = builder.inputType('StringListFilter', {
  fields: (t) => ({
    equals: t.stringList(),
    has: t.string(),
    hasEvery: t.stringList(),
    hasSome: t.stringList(),
    isEmpty: t.boolean(),
  }),
})

export const StringFieldUpdateOperations = builder.inputType(
  'StringFieldUpdateOperations',
  {
    fields: (t) => ({
      set: t.string(),
    }),
  },
)

export interface BoolFilter {
  equals?: boolean
  not?: BoolFilter
}

export const BoolFilter = builder.inputRef<BoolFilter>('BoolFilter').implement({
  fields: (t) => ({
    equals: t.boolean(),

    not: t.field({
      type: BoolFilter,
    }),
  }),
})

export const BoolFieldUpdateOperations = builder.inputType(
  'BoolFieldUpdateOperations',
  {
    fields: (t) => ({
      set: t.boolean(),
    }),
  },
)

export interface FloatFilter {
  equals?: number
  gt?: number
  gte?: number
  lt?: number
  lte?: number
  in?: number[]
  notIn?: number[]
  not?: FloatFilter
}

export const FloatFilter = builder
  .inputRef<FloatFilter>('FloatFilter')
  .implement({
    fields: (t) => ({
      equals: t.float(),
      gt: t.float(),
      gte: t.float(),
      lt: t.float(),
      lte: t.float(),

      in: t.floatList(),
      notIn: t.floatList(),

      not: t.field({
        type: FloatFilter,
      }),
    }),
  })

export const FloatFieldUpdateOperations = builder.inputType(
  'FloatFieldUpdateOperations',
  {
    fields: (t) => ({
      set: t.float(),
      decrement: t.float(),
      divide: t.float(),
      increment: t.float(),
      multiply: t.float(),
    }),
  },
)

export interface IntFilter {
  equals?: number
  gt?: number
  gte?: number
  lt?: number
  lte?: number
  in?: number[]
  notIn?: number[]
  not?: IntFilter
}

export const IntFilter = builder.inputRef<IntFilter>('IntFilter').implement({
  fields: (t) => ({
    equals: t.int(),
    gt: t.int(),
    gte: t.int(),
    lt: t.int(),
    lte: t.int(),

    in: t.intList(),
    notIn: t.intList(),

    not: t.field({
      type: IntFilter,
    }),
  }),
})

export const IntFieldUpdateOperations = builder.inputType(
  'IntFieldUpdateOperations',
  {
    fields: (t) => ({
      set: t.int(),
      decrement: t.int(),
      divide: t.int(),
      increment: t.int(),
      multiply: t.int(),
    }),
  },
)

export interface DateTimeFilter {
  equals?: Date
  gt?: Date
  gte?: Date
  lt?: Date
  lte?: Date
  in?: Date[]
  notIn?: Date[]
  not?: DateTimeFilter
}

export const DateTimeFilter = builder
  .inputRef<DateTimeFilter>('DateTimeFilter')
  .implement({
    fields: (t) => ({
      equals: t.field({ type: 'DateTime' }),
      gt: t.field({ type: 'DateTime' }),
      gte: t.field({ type: 'DateTime' }),
      lt: t.field({ type: 'DateTime' }),
      lte: t.field({ type: 'DateTime' }),

      in: t.field({ type: ['DateTime'] }),
      notIn: t.field({ type: ['DateTime'] }),

      not: t.field({
        type: DateTimeFilter,
      }),
    }),
  })

export const DateTimeFieldUpdateOperations = builder.inputType(
  'DateTimeFieldUpdateOperations',
  {
    fields: (t) => ({
      set: t.field({ type: 'DateTime' }),
    }),
  },
)

export const JsonFilter = builder.inputType('JsonFilter', {
  fields: (t) => ({
    array_contains: t.stringList(),
    array_starts_with: t.stringList(),
    array_ends_with: t.stringList(),
    path: t.stringList(),

    isEmpty: t.boolean(),

    equals: t.string(),
    string_contains: t.string(),
    string_starts_with: t.string(),
    string_ends_with: t.string(),
  }),
})

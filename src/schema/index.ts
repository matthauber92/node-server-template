import { builder } from '../builder'
import './generic'
import './user'
import './user/inputs'
import './user/mutations'
import './user/queries'
import './feedback/mutations'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { printSchema } from 'graphql'

export const schema = builder.toSchema({})

writeFileSync(resolve(__dirname, '../../schema.graphql'), printSchema(schema))

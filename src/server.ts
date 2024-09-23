import * as dotenv from 'dotenv'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { schema } from './schema'
import { createContext } from './context'
// TODO: remove render-graphiql before deploying
import { renderGraphiQL } from '@graphql-yoga/render-graphiql'

dotenv.config()

const yoga = createYoga({
  graphqlEndpoint: '/graphql',
  schema,
  context: createContext,
  // TODO: is this a bundle size problem in prod?
  renderGraphiQL,
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log(`\
🚀 Server ready at: http://localhost:4000/graphql
  `)
})

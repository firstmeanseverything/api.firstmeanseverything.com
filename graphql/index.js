const { ApolloServer } = require('apollo-server-micro')
const db = require('@firstmeanseverything/db')
const { makeExecutableSchema } = require('graphql-tools')
const { applyMiddleware } = require('graphql-middleware')

const postmark = require('postmark')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const resolvers = require('./resolvers')
const loaders = require('./loaders')
const permissions = require('./permissions')
const typeDefs = require('./typeDefs')
const { getUserId, withCors } = require('./utils')

const server = new ApolloServer({
  schema: applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
      inheritResolversFromInterfaces: true
    }),
    permissions
  ),
  context: async req => ({
    ...req,
    db,
    loaders,
    postmark: new postmark.ServerClient(process.env.POSTMARK_KEY),
    stripe,
    userId: await getUserId({ ...req })
  }),
  introspection: true,
  playground: true
})

module.exports = withCors(server.createHandler({ path: '/graphql' }))
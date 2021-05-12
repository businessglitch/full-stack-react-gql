import { graphQLSchemaExtension } from "@keystone-next/keystone/schema";
import addToCart from './addToCart';
import checkout from './checkout';
// make a fre graphql string literal
const graphql = String.raw;

export const extendedGraphQLSchema = graphQLSchemaExtension({
    typeDefs: graphql`
        type Mutation {
            addToCart(productId: ID): CartItem
            checkout(token: String!): Order
        }
    `,
    resolvers: {
        Mutation: {
            addToCart,
            checkout
        }
    }
})
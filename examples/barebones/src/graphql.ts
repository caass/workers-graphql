import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Note! we're not creating resolvers or buildExecutableSchema or anything, this is literally just a
// function at the root of the query. Terrible! But, it works for this very simple example.
export const root = { hello: () => "Hello world!" };

import { createGraphqlHandler, createPlaygroundHandler } from "workers-graphql";
import { buildSchema } from "graphql";

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Note! we're not creating resolvers or buildExecutableSchema or anything, this is literally just a
// function at the root of the query. Terrible! But, it works for this very simple example.
var root = { hello: () => "Hello world!" };

const options = {
  playgroundEndpoint: "/playground",
  graphqlEndpoint: "/graphql",
};

const playgroundHandler = createPlaygroundHandler({
  endpoint: options.graphqlEndpoint,
});
const graphqlHandler = createGraphqlHandler({ schema, root });

const fetch = async (
  request: Request,
  env: Record<string, any>
): Promise<Response> => {
  const url = new URL(request.url);

  switch (url.pathname) {
    case options.playgroundEndpoint:
      return playgroundHandler(request);
    case options.graphqlEndpoint:
      return graphqlHandler(request);
    default:
      return new Response(
        `Not found! Try ${options.graphqlEndpoint} or ${options.playgroundEndpoint}`,
        { status: 404 }
      );
  }
};

export default {
  fetch,
};

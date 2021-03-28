import { createGraphqlHandler, createPlaygroundHandler } from "workers-graphql";
import { schema, root } from "./graphql";
import * as options from "./options";

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

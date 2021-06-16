import {
  RenderPageOptions,
  renderPlaygroundPage,
} from "graphql-playground-html";
import { get, RequestHandler, ValueOrInjector } from "./util";

/**
 * Create a request handler for serving the graphql playground page.
 *
 * @param options configuration for rendering the playground, or a function that runs on each request and returns that configuration. See [graphql-playground docs](https://github.com/graphql/graphql-playground#usage) for details on what options are supported.
 * @returns a request handler that serves the rendered playground HTML
 */
export const createPlaygroundHandler = (
  options?: ValueOrInjector<RenderPageOptions>
): RequestHandler => {
  const getOptions = get(options);

  return async (request) => {
    const options = (await getOptions(request)) ?? {};
    const rendered = renderPlaygroundPage(options);
    return new Response(rendered, {
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
      },
    });
  };
};

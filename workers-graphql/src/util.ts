import { ExecutionResult } from "graphql";

/**
 * RequestHandlers are functions that respond to requests
 */
export type RequestHandler = (request: Request) => Response | Promise<Response>;

/**
 * Injectors allow you to supply values at runtime instead of compile-time
 * depending on the request. This is useful for using middleware,
 * e.g. giving different contexts depending on if the user is authenticated.
 */
type Injector<T> = (request: Request) => T | Promise<T>;

/**
 * Allows you to supply a value either at compile-time or runtime.
 */
export type ValueOrInjector<T> = T | Injector<T>;

function isInjector<T>(x: ValueOrInjector<T>): x is Injector<T> {
  return typeof x === "function";
}

/**
 * Transform an optional `ValueOrInjector` into an `Injector<T | undefined>`,
 * making implementations simpler.
 *
 * @param x user-supplied value or injector
 * @returns a function to get the user-supplied value
 */
export function get<T>(
  x: ValueOrInjector<T> | undefined
): Injector<T | undefined> {
  if (!x) {
    return async () => undefined;
  } else if (isInjector(x)) {
    return async (request) => await x(request);
  } else {
    return async () => x;
  }
}

/**
 * Parameters associated with a GraphQL Query
 */
export type QueryInfo = {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
};

/**
 * Ripped directly from Apollo
 * @param request GraphQL request
 * @returns parameters parsed from the request
 */
export const getQueryInfo = async (request: Request): Promise<QueryInfo> => {
  const url = new URL(request.url);
  return request.method === "POST"
    ? await request.json()
    : {
        query: url.searchParams.get("query"),
        variables: url.searchParams.get("variables"),
        operationName: url.searchParams.get("operationName"),
      };
};

/**
 * Translates an `ExecutionResult` into a response
 * @param result the result of executing a GraphQL query
 * @returns a response for sending back to the client
 */
export const ExecutionResultResponse = (result: ExecutionResult): Response =>
  new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

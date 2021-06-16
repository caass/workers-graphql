/**
 * "handlers" are functions that take as one paramater -- a request --, and return a response.
 * The following functions, `createPlaygroundHandler` and `createGraphqlHandler`, have their own
 * args types, and are used to create those handlers -- kind of like a single-use factory.
 */

export { createPlaygroundHandler } from "./playground";
export { createGraphqlHandler } from "./graphql";

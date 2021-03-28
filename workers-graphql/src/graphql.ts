import {
  GraphQLSchema,
  parse as parseQueryString,
  validate as validateQuery,
  execute as executeQuery,
  validateSchema,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
} from "graphql";
import {
  ExecutionResultResponse,
  get,
  getQueryInfo,
  RequestHandler,
  ValueOrInjector,
} from "./util";

type HandlerCreationArgs = {
  schema: GraphQLSchema;
  root?: Record<string, (args: any) => any>;
  context?: ValueOrInjector<Record<string, any>>;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  typeResolver?: GraphQLTypeResolver<any, any>;
};

/**
 * Create a handler function to parase graphql queries.
 *
 * @param schema The GraphQL Schema to run your query against
 * @param root a root value which gets passed to the GraphQL executor
 * @param context a context which gets passed to the GraphQL executor, or a function that runs on each request and returns a context. This is useful for injecting different contexts depending on the request.
 * @returns a request handler that parses and responds to GraphQL queries
 */
export const createGraphqlHandler = ({
  schema,
  root: rootValue,
  fieldResolver,
  typeResolver,
  context,
}: HandlerCreationArgs): RequestHandler => {
  // Validate Schema
  const schemaValidationErrors = validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
    throw {
      message: "Failed to validate schema!",
      errors: schemaValidationErrors,
    };
  }

  const getContext = get(context);

  return async (request) => {
    const {
      query,
      variables: variableValues,
      operationName,
    } = await getQueryInfo(request);

    // Parse
    let document;
    try {
      document = parseQueryString(query);
    } catch (syntaxError) {
      return ExecutionResultResponse({ errors: [syntaxError] });
    }

    const contextValue = await getContext(request);

    // Validate
    const validationErrors = validateQuery(schema, document);
    if (validationErrors.length > 0) {
      return ExecutionResultResponse({ errors: validationErrors });
    }

    // Execute
    const result = await executeQuery({
      schema,
      document,
      rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      typeResolver,
    });

    return ExecutionResultResponse(result);
  };
};

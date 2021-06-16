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

/**
 * A lot of this stuff is ripped almost or completely directly
 * from the graphql reference library, which performs the actual
 * execution.
 */
type HandlerCreationArgs = {
  schema: GraphQLSchema;

  /**
   * [See this](https://graphql.org/learn/execution/#root-fields-resolvers) for uhh
   * more information
   */
  root?: Record<string, (args: any) => any>;

  /**
   * So, for my use-case I never used any context, but I would imagine it's pretty
   * common to have some other middleware that provides some context.
   * So anyway, you can provide a static value as context, or provide a function
   * (an injector) that'll generate context from a request. Look at the typedefs
   * for `ValueOrInjector` for more info.
   */
  context?: ValueOrInjector<Record<string, any>>;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  typeResolver?: GraphQLTypeResolver<any, any>;
};

/**
 * Create a handler function to parse graphql queries.
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

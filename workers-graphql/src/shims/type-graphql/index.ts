/*
 * `type-graphql` is really cool, but has a bunch of node dependencies, mostly
 * for stuff like "get all the schema from a file glob". These shims sidestep
 * that stuff so you can use it in your project.
 */

import { GraphQLSchema } from "graphql";
import { BuildContext } from "type-graphql/dist/schema/build-context";
import {
  SchemaGenerator,
  SchemaGeneratorOptions,
} from "type-graphql/dist/schema/schema-generator";
import { getMetadataStorageShim, SchemaGeneratorPrivateMethods } from "./shims";

/**
 * Turn an array of resolvers classes into a schema for use in `createGraphqlHandler`.
 *
 * This is a shim of the `buildSchemaSync` function from `type-graphql`, copy/pasted and edited
 * to avoid any calls to Node APIs. For your own sanity, don't look at the implementation.
 *
 * @param options see `SchemaGeneratorOptions` in `type-graphql` for details.
 * @returns a `GraphQLSchema` for use in `createGraphqlHandler`
 */
export const buildSchema = (options: SchemaGeneratorOptions): GraphQLSchema => {
  // this is painful, but basically i'm just copying https://github.com/MichalLytek/type-graphql/blob/master/src/utils/buildSchema.ts#L39-L47
  const metadataStorage = getMetadataStorageShim();

  // one of the things type-graphql does is ensure you have the correct deps installed
  // see: SchemaGenerator.checkForErrors
  // we'll just...not...do that...
  // we can do the other check though
  if (metadataStorage.authorizedFields.length > 0 && !options.authChecker) {
    throw new Error(
      "You need to provide `authChecker` function for `@Authorized` decorator usage!"
    );
  }

  BuildContext.create(options);
  metadataStorage.build(options);

  // do some trickery
  const {
    buildTypesInfo,
    buildRootQueryType,
    buildRootMutationType,
    buildRootSubscriptionType,
    buildOtherTypes,
  } = SchemaGeneratorPrivateMethods;

  buildTypesInfo(options.resolvers);

  const orphanedTypes =
    options.orphanedTypes || (options.resolvers ? [] : undefined);

  const prebuiltSchema = new GraphQLSchema({
    query: buildRootQueryType(options.resolvers),
    mutation: buildRootMutationType(options.resolvers),
    subscription: buildRootSubscriptionType(options.resolvers),
    directives: options.directives,
  });

  const finalSchema = new GraphQLSchema({
    ...prebuiltSchema.toConfig(),
    types: buildOtherTypes(orphanedTypes),
  });

  BuildContext.reset();

  SchemaGenerator["usedInterfaceTypes"] = new Set<Function>();

  return finalSchema;
};

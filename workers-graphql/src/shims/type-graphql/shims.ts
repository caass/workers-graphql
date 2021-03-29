import { GraphQLNamedType, GraphQLObjectType } from "graphql";
import { MetadataStorage } from "type-graphql/dist/metadata/metadata-storage";
import { SchemaGenerator } from "type-graphql/dist/schema/schema-generator";

export const getMetadataStorageShim = (): MetadataStorage => {
  // lol selfish
  const selfIsh = self as typeof self & {
    TypeGraphQLMetadataStorage?: MetadataStorage;
  };
  return (
    selfIsh.TypeGraphQLMetadataStorage ||
    (selfIsh.TypeGraphQLMetadataStorage = new MetadataStorage())
  );
};

/**
 * Use some "private" static methods [#justjsthings](https://davembush.github.io/accessing-private-fields-in-typescript/#TypeScript-is-just-JavaScript-with-Sugar)
 */
export const SchemaGeneratorPrivateMethods = {
  buildTypesInfo: (resolvers?: Function[]): GraphQLObjectType =>
    SchemaGenerator["buildTypesInfo"](resolvers),
  buildRootQueryType: (resolvers?: Function[]): GraphQLObjectType | undefined =>
    SchemaGenerator["buildTypesInfo"](resolvers),
  buildRootMutationType: (
    resolvers?: Function[]
  ): GraphQLObjectType | undefined =>
    SchemaGenerator["buildRootMutationType"](resolvers),
  buildRootSubscriptionType: (
    resolvers?: Function[]
  ): GraphQLObjectType | undefined =>
    SchemaGenerator["buildRootSubscriptionType"](resolvers),
  buildOtherTypes: (
    orphanedTypes?: Function[]
  ): GraphQLNamedType[] | undefined =>
    SchemaGenerator["buildOtherTypes"](orphanedTypes),
};

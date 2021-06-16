# workers-graphql [WIP]

A simple library to create a lightweight GraphQL server on Cloudflare Workers.

Examples can be found in the [`/examples`](/examples) folder. To try them out:

```shell
git clone https://github.com/caass/workers-graphql
yarn
yarn workspace @examples/barebones run start # or whatever example
```

## Overview

This library exports two main functions, `createPlaygroundHandler` and `createGraphqlHandler`.

These functions are kind of like factories, except they're functions. But you use them to create
the handlers that you can pass a request into, and get a request out of. It's not unrealistic to
imagine a secnario where you have some middleware, like this:

```typescript
// injector to determine playground options at runtime
const getPlaygroundOptions = async (
  request: Request
): Promise<RenderPageOptions> => {
  const environment = await getEnvironment(request);
  if (environment.hasSubscriptions) {
    return PLAYGROUND_OPTIONS_WITH_SUBSCRIPTION; // some constant
  } else {
    return PLAYGROUND_OPTIONS_NO_SUBSCRIPTION;
  }
};

// or do it statically:
// const playgroundOptions = { ... }

const handlePlayground = createPlaygroundHandler(getPlaygroundOptions);

const handlePlaygroundRequest = async (request: Request): Promise<Response> => {
  const scopes = await getAuthorization(request); // check bearer token or whatever
  const environment = await getEnvironment(request); // check if request target is staging.url.org or whatever
  if (environment == "dev" && scopes.includes("playground")) {
    return handlePlayground(request);
  } else {
    return handleError(request);
  }
};
```

This library is essentially a layer to help you go from `Request`/`Response` to the types used by `graphql-js`. Which I guess is what a GraphQL server is. But this code feels too simple to call it a "server" so.

Many of the types you'll need to use are provided by `graphql-js`, so I recommend looking into [their docs](https://graphql.org/learn/execution/) and the [apollo docs maybe](https://www.apollographql.com/docs/apollo-server/data/resolvers/#passing-resolvers-to-apollo-server)
for more info on that stuff. I use VS Code, so usually I do "go to type definition" and then google that type.

The other thing that is kinda cool is the `Injector<T>` type and its siblings, `ValueOrInjector<T>` and `get<T>`. I'll just paste the typedefs here
since that's probably better than using words, they're available in [src/handlers/util.ts](./src/handlers/util.ts):

```typescript
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
```

So as you can see, it's possible to provide different contexts (in the case of `createGraphqlHandler`) or playground options
(in the case of `createPlaygroundHandler`) per-request.

## Roadmap:

fair warning, i barely (if ever) touch this repo so you're mostly on your own. if you wanna contribute, please review the [contribution guidelines](#contribution-guidelines)

- [ ] Basic functionality
  - [x] GraphQL & playground handlers
  - [ ] Durable Objects-based subscription handler
- [ ] Shims for popular libraries
  - [ ] ~~[TypeGraphQL](https://github.com/MichalLytek/type-graphql)~~
  - [ ] [Apollo Server](https://github.com/apollographql/apollo-server)
- [ ] Working examples
  - [ ] Barebones
    - [x] Basic example
    - [ ] Example using KV
    - [ ] Example using an external API
    - [ ] Example using Durable Objects & subscriptions
  - [ ] Using popular libraries
    - [ ] ~~TypeGraphQL~~
    - [ ] Apollo Server

## Contribution Guidelines

please contribute

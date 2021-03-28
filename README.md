# workers-graphql [WIP]

A simple library to create a lightweight GraphQL server on Cloudflare Workers.

Examples can be found in the [`/examples`](/examples) folder. To try them out:

```shell
git clone https://github.com/caass/workers-graphql
yarn
yarn workspace @examples/basic run start
```

Roadmap:

- [x] GraphQL & playground handlers
- [ ] Durable Objects-based subscription handler
- [x] Basic example
- [ ] Example using KV
- [ ] Example using an external API
- [ ] Example using Durable Objects & subscriptions
- [ ] (does this make sense?) Split into `@workers-graphql/core` and `@workers-graphql/{something}`, a full-featured class with like, `.addDataSource` methods and stuff like that. I bet we could do some cool typestate stuff.

# workers-graphql [WIP]

A simple library to create a lightweight GraphQL server on Cloudflare Workers.

Examples can be found in the [`/examples`](/examples) folder. To try them out:

```shell
git clone https://github.com/caass/workers-graphql
yarn
yarn workspace @examples/barebones run start # or whatever example
```

Roadmap:

- [ ] Basic functionality
  - [x] GraphQL & playground handlers
  - [ ] Durable Objects-based subscription handler
- [ ] Shims for popular libraries
  - [ ] [TypeGraphQL](https://github.com/MichalLytek/type-graphql)
  - [ ] [Apollo Server](https://github.com/apollographql/apollo-server)
- [ ] Working examples
  - [ ] Barebones
    - [x] Basic example
    - [ ] Example using KV
    - [ ] Example using an external API
    - [ ] Example using Durable Objects & subscriptions
  - [ ] Using popular libraries
    - [ ] TypeGraphQL
    - [ ] Apollo Server

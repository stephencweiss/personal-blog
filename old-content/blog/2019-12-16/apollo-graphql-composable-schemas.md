---
title: 'Extending GraphQL Schema Definitions with Apollo'
date: '2019-11-28'
publish: '2019-12-16'
updated: ['2020-04-03']
category: ['graphql']
tags: ['apollo', 'composable', 'schema']
---

When defining a GraphQL schema, it can be useful to define it in multiple files to keep it manageable.

```javascript:title=./src/index.js
import { buildSchema } from 'graphql'
import { schemaToTemplateContext } from 'graphql-codegen-core'
import { loadTypeSchema } from '../../../utils/schema'
import { mockServer } from 'graphql-tools'

const root = `
  schema {
    query: Query
    mutation: Mutation
  }
`

const typeSchemas = await Promise.all(
    ['product', 'user', 'coupon'].map(loadTypeSchema) //highlight-line
)

typeDefs = root + typeSchemas.join(' ')
schema = schemaToTemplateContext(buildSchema(typeDefs))
```

`typeSchemas` is then the resolved promise of passing our three strings `product`, `user`, and `coupon`, into `loadTypeSchema`.

The `loadTypeSchema` is:

```javascript:title=./utils/schema
import fs from 'fs'
import path from 'path'

export const loadTypeSchema = (type) =>
    new Promise((resolve, reject) => {
        const pathToSchema = path.join(
            process.cwd(),
            `src/types/${type}/${type}.gql`
        )
        fs.readFile(pathToSchema, { encoding: 'utf-8' }, (err, schema) => {
            if (err) {
                return reject(err)
            }

            resolve(schema)
        })
    })
```

This is a function that takes a type (which is our string), and then uses Node's `fs` module to attempt to read it.

Let's look at the `product` schema in more detail to understand how this works.

```graphql:title=product.gql
enum ProductType {
  GAMING_PC
  BIKE
  DRONE
}

enum BikeType {
  KIDS
  MOUNTAIN
  ELECTRIC
  BEACH
}

type Product {
  name: String!
  price: Float!
  image: String!
  type: ProductType!
  description: String
  liquidCooled: Boolean
  bikeType: BikeType
  range: String
  createdBy: User!
}

input NewProductInput {
  name: String!
  price: Float!
  image: String!
  type: ProductType!
  description: String
  liquidCooled: Boolean
  bikeType: BikeType
  range: String
}

input UpdateProductInput {
  name: String
  price: Float
  image: String
  description: String
  liquidCooled: Boolean
  bikeType: BikeType
  range: String
}

extend type Query {//highlight-line
  product(id: ID!): Product
  products: [Product]
}

extend type Mutation {//highlight-line
  newProduct(input: NewProductInput): Product
  updateProduct(id: ID, input: UpdateProductInput): Product
  removeProduct(id: ID, input: UpdateProductInput): Product
}
```

So what's happening?

Starting with our `root`, we scaffold out a schema that includes `Query` and `Mutation` objects, but nothing's defined.

We build up the schema for both `Query` and `Mutation` by mapping over our array of strings.

Each one has a file like our `products.gql` which is then used to _extend_ the schema thanks to the helper function `loadTypeSchema` (notice that it's `extend type Query`, not `type Query`).

Each of these `.gql` files is then appended to the `root` which is then passed into the `buildSchema` function that is imported from `graphql`.

The important part here is that because we're pulling multiple `.gql` files together, if they include new `Query` or `Mutation` objects, we need to `extend` them.

If we don't extend, we'll get a syntax error as we try to overwrite the `Query` and `Mutation` objects.

```shell
      at syntaxError (node_modules/graphql/error/syntaxError.js:15:10)
      at Parser.unexpected (node_modules/graphql/language/parser.js:1463:41)
      at Parser.parseDefinition (node_modules/graphql/language/parser.js:157:16)
      at Parser.many (node_modules/graphql/language/parser.js:1518:26)
      at Parser.parseDocument (node_modules/graphql/language/parser.js:111:25)
      at Object.parse (node_modules/graphql/language/parser.js:36:17)
      at Object.buildSchemaFromTypeDefinitions (node_modules/graphql-tools/src/generate/buildSchemaFromTypeDefinitions.ts:37:19)
      at mockServer (node_modules/graphql-tools/src/mock.ts:42:16)
      at Object.<anonymous> (src/types/product/__tests__/product.type.spec.js:163:22)
```

So, while this approach requires a little more setup up front, it has the benefit of enabling composable grpahql schemas.

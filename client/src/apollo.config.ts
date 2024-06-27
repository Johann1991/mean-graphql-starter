import { HttpClientModule } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';

const uri = 'http://localhost:5006/graphql'; // GraphQL server URL

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
  }
`;

const mocks = {
  User: () => ({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
  }),
};

const schema = makeExecutableSchema({ typeDefs });
const schemaLink = new SchemaLink({ schema });

export function createApollo(httpLink: HttpLink) {
  // Hardcoding the environment to 'development' for demonstration purposes
  const isProduction = false;
  const link = isProduction ? httpLink.create({ uri }) : schemaLink;
  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [HttpClientModule, ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

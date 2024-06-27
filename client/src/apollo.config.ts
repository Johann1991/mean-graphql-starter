import { HttpClientModule } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';

const uri = 'http://mean-graphql-starter-serv-ozph-service:3000/graphql'; // <-- Update with correct URL

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
const mockLink = new SchemaLink({ schema });

export function createApollo(httpLink: HttpLink) {
  const link = httpLink.create({ uri }); // Use HTTP link for production
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

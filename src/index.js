import 'dotenv/config';
import 'cross-fetch/polyfill';
import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
      }
    })
  }
});

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organization: String!) {
    organization(login: $organization) {
      name
      url
      repositories(first: 5) {
        edges {
          node {
            name
            url
          }
        }
      }
    }
  }
`;

client
  .query({
    query: GET_REPOSITORIES_OF_ORGANIZATION ,
    variables: {
      organization: 'the-road-to-learn-react',
    }
  })
  .then(console.log)
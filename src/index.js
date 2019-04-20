import 'dotenv/config';
import 'cross-fetch/polyfill';
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operations.setContext({
      headers: {
        authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`
      }
    })
  }
});
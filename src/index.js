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
  query ($organization: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repositories(
        first: 5, 
        orderBy: {field: STARGAZERS, direction: DESC}, 
        after: $cursor
      ) {
        edges { node {...repository } }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }

  fragment repository on Repository {
    name
    url
  }

`;

const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation RemoveStar($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

client
  // first query
  .query({
    query: GET_REPOSITORIES_OF_ORGANIZATION ,
    variables: {
      organization: 'the-road-to-learn-react',
    }
  })
  // resolve first query
  .then(response => {
    const { pageInfo, edges } = response.data.organization.repositories;
    const { endCursor } = pageInfo;

    console.log('second page', edges.length);
    console.log('endCursor', endCursor);

    return pageInfo;
  })
  // second query
  .then(({ hasNextPage, endCursor}) => {
    if (!hasNextPage) throw Error('no next page');
    return client.query({
      query: GET_REPOSITORIES_OF_ORGANIZATION,
      variables: {
        organization: 'the-road-to-learn-react',
        cursor: endCursor
      }
    })
  })
  .then(response => {
    const { pageInfo, edges } = response.data.organization.repositories;
    const { endCursor } = pageInfo;

    console.log('second page', edges.length);
    console.log('endCursor', endCursor);

    return pageInfo;
  }).catch(console.log);

client
  .mutate({
    mutation: ADD_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    },
  })
  .then(console.log);

client
  .mutate({
    mutation: REMOVE_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    },
  })
  .then(console.log);
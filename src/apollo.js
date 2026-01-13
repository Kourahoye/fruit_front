import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { REFRESH_TOKEN_MUTATION } from './graphql/mutations';
import { getTokens, storeTokens } from './manageTokens';

// --- Client pour refresh uniquement ---
const refreshClient = new ApolloClient({
  link: new HttpLink({ uri: "http://127.0.0.1:8000/graphql/" }),
  cache: new InMemoryCache(),
});

// --- Auth Link ---
const authLink = new ApolloLink((operation, forward) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    operation.setContext({
      headers: {
        Authorization: `JWT ${tokens.accessToken}`,
      },
    });
  }
  return forward(operation);
});

// --- Error Link ---
const errorLink = new ErrorLink(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        return new Promise(async (resolve, reject) => {
          try {
            const tokens = getTokens();

            const { data } = await refreshClient.mutate({
              mutation: REFRESH_TOKEN_MUTATION,
              variables: { refreshToken: tokens.refreshToken },
            });

            const { accessToken, refreshToken } = data.refreshToken;
            storeTokens(accessToken, refreshToken);

            // Mettre à jour le header de l'opération initiale
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
              },
            }));

            resolve(forward(operation));
          } catch (error) {
            reject(error);
          }
        });
      }
    }
  }

  return forward(operation); // important si pas d'erreur UNAUTHENTICATED
});

// --- Upload HTTP Link ---
const uploadLink = new UploadHttpLink({
  uri: "http://127.0.0.1:8000/graphql/",
});

// --- Client principal ---
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
});

export default client;

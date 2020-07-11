import Head from "next/head";
import "../styles/app.css";
import ApolloClient, { InMemoryCache } from "apollo-boost";

import { ApolloProvider } from "@apollo/react-hooks";
import UserState from "../Contexts/User/UserState";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:3001/graphql",
});

const App = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <UserState>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </UserState>
    </ApolloProvider>
  );
};

export default App;

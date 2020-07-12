import Head from "next/head";
import "../styles/app.css";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import Cookies from "js-cookie";
import { ApolloProvider } from "@apollo/react-hooks";
import UserState from "../Contexts/User/UserState";
import LanguageState from "../Contexts/Language/LanguageState";

const dev = process.env.NODE_ENV === "development";
const link = dev
  ? "http://localhost:3001/graphql"
  : "http://dolapk.herokuapp.com/graphql";
const userCookie = Cookies.getJSON("loggedUser");
const token = userCookie ? userCookie.token : null;
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: link,
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: token ? `bearer ${token}` : null,
      },
    });
  },
});

const App = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <LanguageState>
        <UserState>
          <Head>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </UserState>
      </LanguageState>
    </ApolloProvider>
  );
};

export default App;

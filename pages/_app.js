import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/app.css";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import UserState from "../Contexts/User/UserState";
import LanguageState from "../Contexts/Language/LanguageState";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../styles/theme";

const App = ({ Component, pageProps }) => {
  const link = "/graphql";
  const [token, setToken] = useState(null);
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

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    let userCookie = localStorage.getItem("loggedUser");
    if (userCookie) {
      userCookie = JSON.parse(userCookie);
      setToken(userCookie.token);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <LanguageState>
          <UserState>
            <Head>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <CssBaseline />
            <Component {...pageProps} />
          </UserState>
        </LanguageState>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;

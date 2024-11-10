import { Outlet } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import { GlobalProvider } from "./utils/GlobalState";
import { ThemeProvider } from "./pages/ThemeContext";
import Dashboard from "./pages/Dashboard";
//import Themes from './pages/Themes';

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <GlobalProvider>
          <Nav />
          <Outlet />
        </GlobalProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

import { ApolloProvider } from "@apollo/client";
import { Layout } from "components";
import { client } from "./graphql/client";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <AppRoutes />
      </Layout>
    </ApolloProvider>
  );
};

export default App;

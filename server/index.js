const { createServer } = require("http");
const next = require("next");
const express = require("express");
const app = express();
const dev = process.env.NODE_ENV !== "production";
const NextApp = next({ dev });
const handle = NextApp.getRequestHandler();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const ApolloServer = require("./apolloServer");

app.use(cors());

app.get("/api", (req, res) => {
  res.send("Welcome in Dolapk");
});
ApolloServer.applyMiddleware({ app });
app.all("*", (req, res) => {
  return handle(req, res);
});
NextApp.prepare().then(() => {
  const server = createServer(app);
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Server is listening on " + PORT);
    console.log("GraphQL is listening on " + ApolloServer.graphqlPath);
  });
});

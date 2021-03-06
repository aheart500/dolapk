const { createServer } = require("http");
const next = require("next");
const express = require("express");
const app = express();
const dev = process.env.NODE_ENV !== "production";
const NextApp = next({ dev });
const handle = NextApp.getRequestHandler();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const ApolloServer = require("./apolloServer");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

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
  /* 
   const io = require("socket.io")(server);
  let onlineUsers = [];

 io.on("connect", (socket) => {
    let name = "";
    socket.on("logged", (args) => {
      name = args.name;
      onlineUsers.push(args.name);
      io.emit("users", {
        onlineUsers,
      });
    });
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user !== name);
      io.emit("users", {
        onlineUsers,
      });
    });
  }); */
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Server is listening on " + PORT);
    console.log("GraphQL is listening on " + ApolloServer.graphqlPath);
  });
});

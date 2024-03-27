const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./Graph/typeDefs");
const resolvers = require("./Graph/resolvers");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const AdminModel = require("./models/admin");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), SECRET);
      const currentAdmin = await AdminModel.findById(decodedToken.id);

      return { currentAdmin };
    }
  },
});

module.exports = server;

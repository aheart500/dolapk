import { startServerAndCreateNextHandler } from "@as-integrations/next";

import apolloServer from "../../server/apolloServer";
import mongoose from "mongoose";

const connectDb = () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  mongoose
    .connect(process.env.MongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));
};
export default async function handler(req, res) {
  connectDb();

  const handler = startServerAndCreateNextHandler(apolloServer)(req, res);

  return handler;
}

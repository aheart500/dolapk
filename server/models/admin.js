const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
});

module.exports =
  mongoose.models.Admin || new mongoose.model("Admin", AdminSchema);

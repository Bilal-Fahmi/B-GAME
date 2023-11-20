const mongoose = require("mongoose");

//Mongoose connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});
exports.db = mongoose.connection;

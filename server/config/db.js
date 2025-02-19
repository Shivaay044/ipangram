const mongoose = require("mongoose");
require("dotenv").config();




exports.connection = mongoose.connect(process.env.MONGO_URL)
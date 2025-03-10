// Required And connections;
const mongoose = require('mongoose');
require('dotenv').config();
const Link = process.env.LINK;

// Explicitly set the strictQuery option to suppress the warning
mongoose.set('strictQuery', true);

mongoose.connect(Link, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Shop data connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
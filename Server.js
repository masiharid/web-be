require('./Src/Connection/connection');
const express = require('express');
const cors = require('cors');
const App = express();
const User = require('./Src/Routes/userRoute'); // Ensure this path is correct
const Store = require('./Src/Routes/productRoute');
const productadd = require('./Src/Routes/adminRoute');

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:4000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

// Middleware
App.use(cors(corsOptions));
App.use(express.json());

// Route Controller
App.use('/', User);
App.use('/User', User);
App.use("/Product", Store);
App.use('/admin', productadd);

// Port Listening
const PORT = process.env.PORT || 4000;
App.listen(PORT, () => {
  console.log('Port is Running on ' + PORT);
});
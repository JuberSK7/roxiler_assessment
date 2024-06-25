const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const transactionRoutes = require('./routers/transactionRoutes');
const dotenv = require("dotenv");
const connectDB = require('./config/db')


const app = express();

// rest object
app.use(cors());
app.use(bodyParser.json());


//consfig
dotenv.config();

//mongoDB connection
connectDB();

app.use('/api', transactionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const express = require('express');
const {sequelize, authenticateDB } = require('./config/db');
const {router} = require('./routes/todoRoutes');
const {Todo }= require("./models/todo");
const cors = require("cors");
//const validate = require("./middlewares/validate");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
//app.use(express.urlencoded({ extended: true })) no urlencoded routes till now
app.use(cors());
app.use("/",router);


// Sync database and start the server on startup
(async () => {
  try {
    await authenticateDB();  

    await sequelize.sync({ force: false });
    console.log('Database and tables synced!');

    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();

const {Sequelize} = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging:false,
      }
);


const authenticateDB = async() =>{
    try{
        await sequelize.authenticate();
        console.log("Db connected successfuly");
    }
    catch(error){
        console.error("not able to connect to db:");
    }
};

module.exports = {sequelize, authenticateDB};
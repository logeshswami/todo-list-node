const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/db");


const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
      },

    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    dueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    importance: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
    },
    
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  });

  module.exports  = {Todo};
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create user model
class User extends Model {
    // set up method to rum on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration 
User.init(
    {
        id: {
            //use the special sequelize datatypes object provide what type of data it is 
            type: DataTypes.INTEGER,
            //this is the equivalant of SQL's `NOT NULL` option
            allowNull: false,
            //instruct that this is the Primary Key 
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table 
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating
            validate: {
                isEmail: true
            } 
        },
        // define a password column 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long 
                len:[4]
            }
        }
    },
    {
        //Table configuration goes here
        hooks: {
            // set up beforeCreate lifecyle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionsality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //dont automatically create createdAt timestamp feilds
        timestamps: false,
        //dont pluralize name of database table 
        freezeTableName: true,
        //use underscores instead of camel-casing
        underscored: true,
        //make it so our model name statys lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;


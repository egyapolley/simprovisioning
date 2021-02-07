const Sequelize = require("sequelize");

const sequelize = require("../utils/sql_database");


const provisionedSims = sequelize.define("provisioned_sims", {
    id: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    msisdn: {
        type:Sequelize.STRING,
        allowNull: true,

    },

    status: {
        type:Sequelize.STRING,
        allowNull: true,
        defaultValue: "CREATED"

    },

    imei:{
        type:Sequelize.STRING,
        allowNull: true,
        defaultValue:""},


    authKeys: {
        type:Sequelize.STRING,
        allowNull: false,

    },

    imsi: {
        type:Sequelize.STRING,
        unique:true,
        allowNull: false,

    },
    deviceType:{
        type:Sequelize.STRING,
        allowNull: true,
        defaultValue:""


    },
    fileName:{
        type:Sequelize.STRING,
        allowNull: false,

    },

    profileID:{
    type:Sequelize.STRING,
        unique:true,
        allowNull: false,
},


});




module.exports = provisionedSims


const sequelize = require("./db");
const {DataTypes} = require("sequelize");

const Tg = sequelize.define("tg", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    chatId: {type: DataTypes.INTEGER, unique: true}
}, {
    timestamps: false
});

const Word = sequelize.define("word", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rus: {type: DataTypes.STRING},
    tat: {type: DataTypes.STRING},
    audio: {type: DataTypes.STRING}
}, {
    timestamps: false
});

module.exports = {
    Word,
    Tg
};
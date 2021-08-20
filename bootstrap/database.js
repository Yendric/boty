const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: process.env.debug ? console.log : false,
	storage: 'database.sqlite',
});

module.exports = { sequelize };

const Servers = require('../models/Servers');
const Users = require('../models/Users');

Servers.sync();
Users.sync();


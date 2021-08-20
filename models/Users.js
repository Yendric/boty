const Sequelize = require('sequelize');
const { sequelize } = require('../bootstrap/database');

const Users = sequelize.define('Users', {
	snowflake: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	},
	xp: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
	level: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
	},
	messages: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
});

module.exports = Users;
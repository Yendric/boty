const Sequelize = require('sequelize');
const { sequelize } = require('../bootstrap/database');

const Servers = sequelize.define('Servers', {
	guild_id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	},
	auto_role_enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	auto_role: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	welcome_message_enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	welcome_message: {
		type: Sequelize.TEXT,
		defaultValue: 'Welkom op {{server}}, {{naam}}',
	},
	welcome_message_channel: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	goodbye_message_enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	goodbye_message: {
		type: Sequelize.TEXT,
		defaultValue: 'Vaarwel, {{naam}}',
	},
	goodbye_message_channel: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	memes_enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	memes_channel: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

module.exports = Servers;
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Servers = sequelize.define('Servers', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	},
	auto_role_enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	welcome_message_enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	welcome_message: {
		type: Sequelize.TEXT,
		defaultValue: 'Welkom op {{server}}, {{naam}}',
	},
	welcome_channel: {
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
	goodbye_channel: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	memes_channel: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	ticket_category: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

Servers.sync();

module.exports = Servers;
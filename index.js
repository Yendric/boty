const { SlashCreator, GatewayServer } = require('slash-create');
const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path');

module.exports = client;
require('dotenv').config();

const creator = new SlashCreator({
	applicationID: process.env.application_id,
	publicKey: process.env.public_key,
	token: process.env.token,
});

// variables voor overal
client.name = process.env.name;

// Bootstrap
// require('./bootstrap/initSettings');
require('./bootstrap/initEvents');
require('./bootstrap/initMusic');
require('./bootstrap/initDB');

// Debug error handling
if(process.env.debug) {
	client.on('error', (e) => console.warn(e));
	client.on('warn', (e) => console.warn(e));
	creator.on('debug', (message) => console.log(message));
	creator.on('warn', (message) => console.warn(message));
	creator.on('error', (error) => console.error(error));
	creator.on('synced', () => console.info('Commands synced!'));
	creator.on('commandRun', (command, _, ctx) =>
		console.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`));
	creator.on('commandRegister', (command) =>
		console.info(`Commando ingeladen ${command.commandName}`));
	creator.on('commandError', (command, error) => console.error(`Command ${command.commandName}:`, error));
}

creator
	.withServer(new GatewayServer(
		(handler) => client.ws.on('INTERACTION_CREATE', handler),
	))
	.registerCommandsIn(path.join(__dirname, 'commands'))
	.syncCommands();

client.login(process.env.token);

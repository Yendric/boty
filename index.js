const { Client, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_INTEGRATIONS,
	Intents.FLAGS.GUILD_WEBHOOKS,
	Intents.FLAGS.GUILD_INVITES,
	Intents.FLAGS.GUILD_VOICE_STATES,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_MESSAGE_TYPING,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGE_TYPING,
] });

module.exports = { client };

// Bootstrap
client.once('ready', () => {
	require('./bootstrap/database');
	require('./bootstrap/events');
	require('./bootstrap/commands');
	require('./bootstrap/debug');
	require('./bootstrap/music');
	console.info(`${client.user.username} is online op ${client.guilds.cache.size} server(s)!`);
	client.user.setActivity('jou', { type: 'WATCHING' });
});


client.login(process.env.token);

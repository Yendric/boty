const { ensureSettings } = require('../helpers/database');

module.exports = (client, guild) => {
	console.log('Guild gejoined: ' + guild.name);
	ensureSettings(guild.id);
};


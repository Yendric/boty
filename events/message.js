const Discord = require('discord.js');
const xpcooldown = new Set();

module.exports = (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type == 'dm') return;
	const guildConf = client.storage.settings.ensure(msg.guild.id, client.storage.defaultServerSettings);

	if (msg.channel.id === guildConf.channels.memes) {
		(async function() {
			if (msg.attachments.size == 0 && !validURL(msg.content)) return;
			await msg.react('👍');
			await msg.react('👎');
		})();
	}
	// Bericht XP
	if (!xpcooldown.has(msg.author.id)) {
		const randomXp = Math.floor(Math.random(1) * 13) + 1;
		const key = `${msg.guild.id}-${msg.author.id}`;

		client.storage.points.ensure(key, {
			user: msg.author.id,
			guild: msg.guild.id,
			xp: 0,
			messages: 0,
			level: 1,
		});

		client.storage.points.inc(key, 'messages');
		client.storage.points.math(key, '+', randomXp, 'xp');

		const levelUser = client.storage.points.get(key, 'level');
		const xpUser = client.storage.points.get(key, 'xp');
		const nextLevelXp = levelUser * levelUser * 300;

		if (xpUser >= nextLevelXp) {
			client.storage.points.inc(key, 'level');
			const levelEmbed = new Discord.MessageEmbed()
				.setAuthor('Level up!')
				.setColor('#33AAFF')
				.setThumbnail(msg.author.displayAvatarURL())
				.setDescription(`Nieuw level: **${client.storage.points.get(key, 'level')}**`)
				.setFooter('Woop Woop!');

			msg.channel.send(levelEmbed);
		}
		xpcooldown.add(msg.author.id);
		setTimeout(() => {
			xpcooldown.delete(msg.author.id);
		}, 5000);
	}
	if (guildConf.reclameFilter == false || guildConf.reclameFilter == 'false') return;
	const reclame = ['http://', 'https://', 'www.', '.nl', '.be', '.com', 'discord.me', 'discord.gg'];
	const whitelist = ['.png', '.gif', '.jpg', 'yendric.be', 'google', 'esl', '.mp4', '.mp3', '.m4a', 'youtube', 'csgo', 'steam', 'discordapp.net'];
	reclame.filter(ad => msg.content.toLowerCase().includes(ad)).forEach(() => {
		if (whitelist.filter(item => msg.content.toLowerCase().includes(item)).length > 0) return;
		msg.delete();
		return msg.channel.send(new Discord.MessageEmbed()
			.setTitle(msg.guild.name + ' | ReclameFilter')
			.setColor('#ff0000')
			.setDescription(`Deze link staat niet op de whitelist, <@${msg.author.id}>. Als je vindt dat dit een fout is, neem dan contact met ons op`)
			.setTimestamp(new Date())
			.setFooter('Opgevraagd door ' + msg.member.displayName),
		).then(embedMessage => embedMessage.delete({ timeout: 5000 }));
	});
};

function validURL(str) {
	return new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(str);
}
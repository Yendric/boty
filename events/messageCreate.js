const { MessageEmbed } = require('discord.js');
const { getSettings, getUser } = require('../helpers/database');
const xpcooldown = new Set();

module.exports = async (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type == 'dm') return;

	const serverSettings = await getSettings(msg.guild.id);

	// Memes
	if (msg.channel.id === serverSettings.memes_channel && serverSettings.memes_enabled) {
		if (msg.attachments.size == 0 && !validURL(msg.content)) return;
		await msg.react('👍');
		await msg.react('👎');
	}

	// Bericht XP
	if (!xpcooldown.has(msg.author.id)) {
		const userData = await getUser(msg.author.id);
		const randomXp = Math.floor(Math.random(1) * 13) + 1;

		userData.increment('messages');
		userData.increment('xp', { by: randomXp });

		const levelUser = userData.get('level');
		const xpUser = userData.get('xp');
		const nextLevelXp = levelUser * levelUser * 300;

		if (xpUser >= nextLevelXp) {
			userData.increment('level');
			const levelEmbed = new MessageEmbed()
				.setAuthor('Level up!')
				.setColor('#33AAFF')
				.setThumbnail(msg.author.displayAvatarURL())
				.setDescription(`Nieuw level: **${levelUser + 1}**`)
				.setFooter('Woop Woop!');

			msg.channel.send({ embeds: [levelEmbed] });
		}
		xpcooldown.add(msg.author.id);
		setTimeout(() => xpcooldown.delete(msg.author.id), 5000);
	}
};

function validURL(str) {
	return new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(str);
}
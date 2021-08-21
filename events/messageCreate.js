const { MessageEmbed } = require('discord.js');
const { getSettings, getUser } = require('../helpers/database');
const xpcooldown = new Set();

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return;
		if (message.channel.type == 'dm') return;

		const serverSettings = await getSettings(message.guild.id);

		// Memes
		if (message.channel.id === serverSettings.memes_channel && serverSettings.memes_enabled) {
			if (message.attachments.size == 0 && !validURL(message.content)) return;
			await message.react('👍');
			await message.react('👎');
		}

		// Bericht XP
		if (!xpcooldown.has(message.author.id)) {
			const userData = await getUser(message.author.id);
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
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(`Nieuw level: **${levelUser + 1}**`)
					.setFooter('Woop Woop!');

				message.channel.send({ embeds: [levelEmbed] });
			}
			xpcooldown.add(message.author.id);
			setTimeout(() => xpcooldown.delete(message.author.id), 5000);
		}
	},
};

function validURL(str) {
	return new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(str);
}
const { MessageEmbed } = require('discord.js');
const { getSettings } = require('../helpers/database');
const { getChannel } = require('../helpers/discord');

module.exports = async (client, member) => {
	console.log('hi');

	const serverSettings = await getSettings(member.guild.id);
	// goodbyemessage
	if (serverSettings.goodbye_message_enabled) {
		let goodbyeMessage = serverSettings.goodbye_message;
		goodbyeMessage = goodbyeMessage.replace('{{naam}}', `${member}`);
		goodbyeMessage = goodbyeMessage.replace('{{server}}', member.guild.name);

		const goodbyeChannel = getChannel(serverSettings.goodbye_message_channel);
		if (!goodbyeChannel) return;
		goodbyeChannel.send({ embeds: [new MessageEmbed()
			.setTitle(`${member.guild.name}`)
			.setColor('#ff0000')
			.setDescription(goodbyeMessage)
			.setThumbnail(`${member.user.displayAvatarURL()}`)
			.setTimestamp(new Date())
			.setFooter(`Er zijn nu ${member.guild.memberCount} leden!`),
		] }).catch();
	}
};


const { MessageEmbed } = require('discord.js');
const { getSettings } = require('../helpers/database');
const { getRole, getChannel } = require('../helpers/discord');

module.exports = async (client, member) => {
	console.log('hi');
	const serverSettings = await getSettings(member.guild.id);
	// autorole
	if (serverSettings.auto_role_enabled) {
		const autoRole = getRole(member.guild.id, serverSettings.auto_role);
		member.roles.add(autoRole).catch();
	}
	// welcome message
	if (serverSettings.welcome_message_enabled) {
		let welcomeMessage = serverSettings.welcome_message;
		welcomeMessage = welcomeMessage.replace('{{naam}}', `${member}`);
		welcomeMessage = welcomeMessage.replace('{{server}}', member.guild.name);

		// joinmessage
		const welcomeChannel = getChannel(serverSettings.welcome_message_channel);
		if (!welcomeChannel) return;
		welcomeChannel.send({ embeds: [new MessageEmbed()
			.setTitle(`${member.guild.name}`)
			.setColor('#00ff00')
			.setDescription(welcomeMessage)
			.setThumbnail(`${member.user.displayAvatarURL()}`)
			.setTimestamp()
			.setFooter(`Er zijn nu ${member.guild.memberCount} leden!`),
		] }).catch();
	}
};


const Discord = require('discord.js');

module.exports = async (client, member) => {
	// autorole
	client.storage.settings.ensure(member.guild.id, client.storage.defaultServerSettings);
	const autoRoleBool = client.storage.settings.get(member.guild.id, 'autoRole');
	if (autoRoleBool) {
		const autoRoleSnowflake = client.storage.settings.get(member.guild.id, 'roles.default');
		const autoRole = member.guild.roles.cache.get(autoRoleSnowflake);
		member.roles.add(autoRole).catch(e => console.log(e));
	}
	// welcome message
	const welcomeBool = client.storage.settings.get(member.guild.id, 'welcomeMessage');
	if (welcomeBool === true || welcomeBool === 'true') {
		let welcomeMessage = client.storage.settings.get(member.guild.id, 'messages.welcome');
		welcomeMessage = welcomeMessage.replace('{{user}}', `${member}`);
		welcomeMessage = welcomeMessage.replace('{{discord}}', member.guild.name);

		// joinmessage
		const welcomeChannel = member.guild.channels.cache.get(client.storage.settings.get(member.guild.id, 'channels.welcome'));
		if (welcomeChannel) {
			welcomeChannel.send(new Discord.MessageEmbed()
				.setTitle(`${member.guild.name}`)
				.setColor('#00ff00')
				.setDescription(welcomeMessage)
				.setThumbnail(`${member.user.displayAvatarURL()}`)
				.setTimestamp(new Date())
				.setFooter(`Er zijn nu ${member.guild.memberCount} leden!`),
			);
		}
	}
};


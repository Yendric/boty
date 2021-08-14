const Discord = require('discord.js');

module.exports = (client, member) => {
	client.storage.settings.ensure(member.guild.id, client.storage.defaultServerSettings);
	const goodbyeBool = client.storage.settings.get(member.guild.id, 'goodbyeMessage');
	if (goodbyeBool === true || goodbyeBool === 'true') {
		let goodbyeMessage = client.storage.settings.get(member.guild.id, 'messages.goodbye');
		goodbyeMessage = goodbyeMessage.replace('{{user}}', `<@${member.user.id}>`);
		goodbyeMessage = goodbyeMessage.replace('{{discord}}', member.guild.name);

		// goodbyemessage
		const goodbyeChannel = member.guild.channels.cache.get(client.storage.settings.get(member.guild.id, 'channels.goodbye'));
		if (goodbyeChannel) {
			goodbyeChannel.send(new Discord.MessageEmbed()
				.setTitle(`${member.guild.name}`)
				.setColor('#ff0000')
				.setDescription(goodbyeMessage)
				.setThumbnail(`${member.user.displayAvatarURL()}`)
				.setTimestamp(new Date())
				.setFooter(`Er zijn nu ${member.guild.memberCount} leden!`),
			);
		}
	}
};


const { SlashCommand } = require('slash-create');
const client = require('../../index.js');
const { MessageEmbed } = require('discord.js');

module.exports = class InfoCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'info',
			description: 'Info over de discord server.',
		});
	}

	async run(ctx) {
		ctx.defer();
		const guild = client.guilds.cache.get(ctx.guildID);
		ctx.send({
			embeds: [
				new MessageEmbed()
					.setTitle(guild.name + ' | Info')
					.setColor('#33aaff')
					.addField('Leden:', guild.memberCount)
					.addField('Bots:', guild.members.cache.filter(member => member.user.bot).size)
					.addField('Mensen:', guild.members.cache.filter(member => !member.user.bot).size)
					.addField('Online mensen:', guild.members.cache.filter(member => member.presence.status !== 'offline' && !member.user.bot).size)
					.addField('Offline mensen:', guild.members.cache.filter(member => member.presence.status == 'offline' && !member.user.bot).size)
					.setTimestamp()
					.setFooter('Opgevraagd door ' + ctx.member.displayName)
					.toJSON(),
			],
		});
	}
};

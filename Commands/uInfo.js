/* eslint-disable no-undef */
const Discord = require('discord.js');

module.exports = {
	name: 'uinfo',
	description: 'Displays user info',
	execute(message, args) {
		const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
		const userEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('User Info:')
			.setURL('')
			.setAuthor(message.author.username, avatar, avatar)
			.setThumbnail(avatar)
			.addFields(
				{ name: 'Name: ', value:message.author.tag },
				{ name: 'Joined Discord: ', value:message.author.createdAt.toDateString() },
				)
			.setTimestamp()
			.setFooter('boob', avatar);
		message.channel.send(userEmbed);
	},
};
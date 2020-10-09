/* eslint-disable no-undef */
const Discord = require('discord.js');
module.exports = {
	name: 'Music Commands',
	commands:{
		play:{
			name:'play',
			description: 'plays music',
			cooldown: 2,
			music: true,
			execute(message, args, broadcasts) {
				// send the message to the channel
				if(!message.member.voice.channelID) return;

				async function join(channel) {
					if (!channel.joinable) {
						console.log('channel not joinable');
						return;
					}
					const connection = await channel.join();
					const broadcast = message.client.voice.createBroadcast();
					const dispatcher = broadcast.play('http://jerl.me:8000/jerl');
					connection.play(broadcast);
					dispatcher.on('start', () => {
						console.log('icecast started');
					});
					dispatcher.on('finish', () => {
						console.log('icecast finished');
					});
					dispatcher.on('error', console.log);
					broadcasts[channel.id] = broadcast;
				}
				try {
					join(message.member.voice.channel);
				}
				catch(error) {
					console.error(error);
					return message.reply('there was an error trying to execute that command!');
				}
			},
		},
		stop:{
			name:'stop',
			description: 'stops music',
			cooldown: 2,
			music: true,
			execute(message, args, broadcasts) {
				if(!message.member.voice.channelID) return;
				broadcasts[message.member.voice.channelID].end();
				delete broadcasts[message.member.voice.channelID];
				message.guild.members.cache.get(process.env.BOTID).voice.connection.disconnect();
			},
		},
	},
};
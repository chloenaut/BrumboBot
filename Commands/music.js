/* eslint-disable no-undef */
module.exports = {
	name: 'play',
	commands:{
		play:{
			description: 'Pings Bot',
			cooldown: 2,
			music: true,
			execute(message, args, broadcasts) {
				// send the message to the channel
				const user = message.guild.members.get(message.author.id);
				if(!user.VoiceState.channelID) return;

				async function join(channel) {
					if (!channel.joinable) {
						console.log('channel not joinable');
						return;
					}
					const connection = await channel.join();
					const broadcast = client.voice.createBroadcast();
					const dispatcher = broadcast.play('http://jerl.me:8000/jerl2');
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
					join(user.VoiceState.channel);
				}
				catch(error) {
					console.error(error);
					return message.reply('there was an error trying to execute that command!');
				}
			},
		},
		stop:{
			description: 'Stops Audio',
			cooldown: 2,
			music: true,
			execute(message, args, broadcasts) {
				const user = message.guild.members;
				if(!user.VoiceState.channelID) return;
				broadcasts[user.VoiceState.channelID].end();
				delete broadcasts[user.VoiceState.channelID];
			},
		},
	},
};
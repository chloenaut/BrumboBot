/* eslint-disable no-undef */
module.exports = {
	name: 'ping',
	description: 'Pings Bot',
	cooldown: 2,
	execute(message, args) {
		// send the message to the channel
		const ping = Date.now() - message.createdTimestamp + ' ms';
		message.channel.send('Pong: ' + ping);
	},
};
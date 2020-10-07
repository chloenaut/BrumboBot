/* eslint-disable no-undef */
module.exports = {
	name: 'help',
	description: 'Help!',
	execute(message, args) {
		// send the message to the channel
		let s = '';
		message.client.commands.each(command => s += ('**' + command.name + '**' + '\n`' + command.description + '`\n'));
		message.channel.send(s);
	},
};
/* eslint-disable no-undef */
module.exports = {
	commands:{
		roll:{
			description: 'Rolls dice\nUsage: $roll [number of dice] [sides on dice]\n--Numbers have to be positive\n--The number of dice has to be less than 20',
			execute(message, args) {
				// send the message to the channel
				const ptn = /^[0-9]$/;
				if (!args.length || args.length > 2 || !(ptn.test(args[0]) || ptn.test(args[1])) || (args[0] < 0 || args[1] < 0 || args[0] > 20)) {
					return message.channel.send('`Usage: $roll [number of dice] [sides on dice]\n--Numbers have to be positive\n--The number of dice has to be less than 20`');
				}
				else{
					let rolls = '';
					let total = 0;
					let roll = 0;
					for(i = 0;i < args[0];i++) {
						roll = Math.floor(Math.random() * args[1] + 1);
						total += roll;
						rolls += '**Roll ' + (i + 1) + ':** ' + roll + '\n';
					}
					const avg = total / args[0];
					rolls += 'Total: ' + total + '\nAverage: ' + avg;
					message.channel.send(rolls);
				}
			},
		},
	},
};
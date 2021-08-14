const Enmap = require('enmap');
const client = require('../index');

client.storage = {
	settings: new Enmap({
		name: 'settings',
		fetchAll: false,
		autoFetch: true,
		cloneLevel: 'deep',
	}),

	points: new Enmap({
		name: 'levels',
	}),

	defaultServerSettings: {
		prefix: '!',
		autoRole: true,
		welcomeMessage: true,
		goodbyeMessage: true,
		reclameFilter: true,
		channels: {
			goodbye: '',
			welcome: '',
			giveaway: '',
			ticket_category: '',
			memes: '',
		},
		roles: {
			default: 'Member',
			moderator: 'Moderator',
			administrator: 'Administrator',
			owner: 'Owner',
		},
		messages: {
			welcome: 'Welkom {{user}} in de {{discord}} discord!\nWe wensen je veel plezier!\nHeb je vragen of zit je ergens mee? Contacteer een moderator!',
			goodbye: 'Tot ziens {{user}}!\nJammer dat je onze discord-server verlaat.\nHopelijk kom je nog eens terug!',
		},
	},
};
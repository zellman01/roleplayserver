'use strict';

exports.commands = {
	si: 'serverinfo',
	serverinfo: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse("/help serverinfo");
		switch (target) {
		case "groups":
			this.sendReplyBox(
				`These are the only ranks used in official rooms on this server<br />` +
				`\u2605 <strong>Room Host</strong> - The person currently hosting an RP in that specific room.<br /><br />` +
				`# <strong>Room Owner</strong> - Only given to the bot (except in major cases).<br />` +
				`<br />` +
				`<strong>Global Staff</strong><br />` +
				`% <strong>Driver</strong> - These are staff members under a trial, so you can call them in a sense a trial moderator.<br />` +
				`<strong>Drivers</strong> have some control of the bot, but not much, as well as all of the driver server commands.<br /><br />` +
				`@ <strong>Moderator</strong> - These are the lowest an actual staff member may be.<br />` +
				`<strong>Moderators</strong> have more control over the bot then Drivers, and have mod server commands.<br /><br />` +
				`& <strong>Leaders</strong> - Lowest upper staff member.<br />` +
				`<strong>Leaders</strong> have almost full control of the bot, and can use leader server commands.<br /><br />` +
				`~ <strong>Administrators</strong> - Server owners.<br />` +
				`<strong>Administartors</strong> have full control of the bot, and the server.`
			);
			break;
		case "legends":
			this.sendReply("This is not finished yet.");
			break;
		case "rules":
			this.sendReply("This is not finished yet.");
			break;
		}
	},
	serverinfohelp: [
		`/serverinfo <target> - Shows various information on the server`,
		`!serverinfo <target> - Displays the information to everyone. Requires + % @ * # & ~.`,
		`Things that can be shown: groups, legends, rules.`,
	],
};

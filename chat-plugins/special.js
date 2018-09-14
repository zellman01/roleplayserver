'use strict';

exports.commands = {
	si: 'serverinfo',
	serverinfo: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse("/help serverinfo");
		switch (target) {
		case "groups":
			this.sendReplyBox(
				`There are no room ranks, besides Host and Room Owner.<br />` +
				`\u2605 <strong>Room Host</strong> - The person currently hosting an RP in that specific room.<br />` +
				`# <strong>Room Owner</strong> - Only given to the bot (except in major cases).<br />` +
				`<br />` +
				`<strong>Global Staff</strong><br />` +
				`% <strong>Driver</strong> - These are staff members under a trial, so you can call them in a sense a trial moderator.<br />` +
				`Drivers have some control of the bot, but not much, as well as all of the driver server commands.<br />` +
				`@ <strong>Moderator</strong> - These are the lowest an actual staff member may be.<br />` +
				`Moderators have more control over the bot then Drivers, and have mod server commands.<br />` +
				`& <strong>Leaders</strong> - Lowest upper staff member.<br />` +
				`Leaders have almost full control of the bot, and can use leader server commands.<br />` +
				`~ <strong>Administrators</strong> - Server owners.<br />` +
				`Administartors have full control of the bot, and the server.`
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
		`!serverinfo <target> - Displays the information to everyone. Requires + $ @ * # & ~.`,
		`Things that can be shown: groups, legends, rules."`,
	],
};

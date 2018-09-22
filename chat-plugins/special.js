'use strict';

exports.commands = {
	si: 'serverinfo',
	serverinfo: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse("/help serverinfo");
		switch (target) {
		case "groups":
			this.sendReplyBox(
				`These are the only ranks used in official rooms on this server, with the exception of Lobby<br />` +
				`\u2605 <strong>Room Host</strong> - The person currently hosting an RP in that specific room.<br /><br />` +
				`# <strong>Room Owner</strong> - Only given to the bot (except in major cases).<br />` +
				`<br />` +
				`<strong>Globals</strong><br />` +
				`+ <strong>Voice</strong> - These users are not staff members.<br />` +
				`<strong>Voices</strong> are exceptional users. The best way to get this is either doing a major contribution to the ` +
				`server, or being an exceptional roleplayer.<br /><br />` +
				`% <strong>Driver</strong> - These are staff members under a trial, so you can call them in a sense a trial moderator.<br />` +
				`<strong>Drivers</strong> have some control of the bot, but not much, as well as all of the driver server commands.<br />` +
				`Users must be global voice in order to ask for the position<br /><br />` +
				`@ <strong>Moderator</strong> - These are the lowest an actual staff member may be.<br />` +
				`<strong>Moderators</strong> have more control over the bot then Drivers, and have mod server commands.<br /><br />` +
				`& <strong>Leader</strong> - Lowest upper staff member.<br />` +
				`<strong>Leaders</strong> have almost full control of the bot, and can use leader server commands.<br /><br />` +
				`~ <strong>Administrator</strong> - Server owners.<br />` +
				`<strong>Administartors</strong> have full control of the bot, and the server.`
			);
			break;
		case "legends":
			this.parse('/legend');
			break;
		case "rprules":
			this.sendReplyBox(
				`<b><center>Roleplay rules</center></b><ol>` +
				`<li>Even though this server is dedicated to roleplaying, some rooms (majorly unofficial rooms) will NOT have any roleplaying aspect.` +
				` If the room does not, it will say somewhere in the room description or roomintro. Please respect that decision.</li>` +
				`<li>No ERP. Ever. Not even if it's in PMs and you are both adults.</li>` +
				`<li>Three people may have control of a legend, but only one of that legend can be in a rp. For example, if two people have legend perms` +
				` for Lugia, only one of them may use Lugia in a roleplay (unless the host says otherwise).</li>` +
				`<li><b><u>Don't argue with staff. Ever</u></b> (unless both you and the staff member are in an rp and your characters are arguing).` +
				` If a staff member pauses or stops the rp without an endpoll, they probably have a good reason to do it (Staff, you must give a reason as` +
				` to why you stop without an endpoll).</li>` +
				`<li>No god-modding. This will also probably be in all documents as a rule somewhere.</li>` +
				`</ol>`
			);
			break;
		default:
			return this.errorReply("Error in command execution. Did you type the command correctly?");
		}
	},
	serverinfohelp: [
		`/serverinfo <target> - Shows various information on the server`,
		`!serverinfo <target> - Displays the information to everyone. Requires + % @ * # & ~.`,
		`Things that can be shown: groups, legends, rprules.`,
	],
	clearall: 'clearroom',
	clearroom: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (room.battle) return this.sendReply("You cannot clearall in battle rooms.");

		let len = (room.log.log && room.log.log.length) || 0;
		let users = [];
		while (len--) {
			room.log.log[len] = '';
		}
		for (let u in room.users) {
			if (!Users.get(u) || !Users.get(u).connected) continue;
			users.push(u);
			Users(u).leaveRoom(room, Users.get(u).connections[0]);
		}
		len = users.length;
		setTimeout(() => {
			while (len--) {
				Users(users[len]).joinRoom(room, Users(users[len]).connections[0]);
			}
		}, 1000);
	},
};

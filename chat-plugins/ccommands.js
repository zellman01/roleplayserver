'use strict';

exports.commands = {
	pmus: 'pmupperstaff',
	pmupperstaff: function (target, room, user) {
		if (!this.can('lock')) return false;
		if (!target) return this.parse("/help pmupperstaff");
		RPC.messageSeniorStaff(target, `~Upper Staff`, user.getIdentity());
		this.sendReply(`Message sent successfully.`);
	},
	pmupperstaffhelp: ["/pmupperstaff <message> - PMs all online upper staff. Requires % @ * & ~"],

	pms: 'pmstaff',
	pmstaff: function (target, room, user) {
		if (!this.can('broadcast')) return false;
		if (!target) return this.parse("/help pmstaff");
		RPC.pmStaff(target, `~Staff`, user.getIdentity());
		this.sendReply(`Message sent successfully`);
	},
	pmstaffhelp: ["/pmstaff <message> - PMs all online staff. Requires + % @ * & ~"],

	'!authority': true,
	auth: 'authority',
	stafflist: 'authority',
	globalauth: 'authority',
	authlist: 'authority',
	authority: function (target, room, user, connection) {
		if (target) {
			let targetRoom = Rooms.search(target);
			let unavailableRoom = targetRoom && targetRoom.checkModjoin(user);
			if (targetRoom && !unavailableRoom) return this.parse('/roomauth1 ' + target);
			return this.parse('/userauth ' + target);
		}
		let rankLists = {};
		let ranks = Object.keys(Config.groups);
		for (let u in Users.usergroups) {
			let rank = Users.usergroups[u].charAt(0);
			if (rank === ' ') continue;
			// In case the usergroups.csv file is not proper, we check for the server ranks.
			if (ranks.includes(rank)) {
				let name = Users.usergroups[u].substr(1);
				if (!rankLists[rank]) rankLists[rank] = [];
				if (name) rankLists[rank].push(RPC.nameColor(name, (Users(name) && Users(name).connected)));
			}
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank
		).map(r =>
			(Config.groups[r] ? "<b>" + Config.groups[r].name + "s</b> (" + r + ")" : r) + ":\n" + rankLists[r].sort((a, b) => toId(a).localeCompare(toId(b))).join(", ")
		);

		if (!buffer.length) return connection.popup("This server has no global authority.");
		connection.send("|popup||html|" + buffer.join("\n\n"));
	},

	'!roomauth': true,
	roomstaff: 'roomauth',
	roomauth1: 'roomauth',
	roomauth: function (target, room, user, connection, cmd) {
		let userLookup = '';
		if (cmd === 'roomauth1') userLookup = '\n\nTo look up auth for a user, use /userauth ' + target;
		let targetRoom = room;
		if (target) targetRoom = Rooms.search(target);
		if (!targetRoom || targetRoom.id === 'global' || !targetRoom.checkModjoin(user)) return this.errorReply(`The room "${target}" does not exist.`);
		if (!targetRoom.auth) return this.sendReply("/roomauth - The room '" + (targetRoom.title || target) + "' isn't designed for per-room moderation and therefore has no auth list." + userLookup);

		let rankLists = {};
		for (let u in targetRoom.auth) {
			if (!rankLists[targetRoom.auth[u]]) rankLists[targetRoom.auth[u]] = [];
			rankLists[targetRoom.auth[u]].push(u);
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank
		).map(r => {
			let roomRankList = rankLists[r].sort();
			roomRankList = roomRankList.map(s => ((Users(s) && Users(s).connected) ? RPC.nameColor(s, true) : RPC.nameColor(s)));
			return (Config.groups[r] ? Chat.escapeHTML(Config.groups[r].name) + "s (" + Chat.escapeHTML(r) + ")" : r) + ":\n" + roomRankList.join(", ");
		});

		if (!buffer.length) {
			connection.popup("The room '" + targetRoom.title + "' has no auth." + userLookup);
			return;
		}
		if (targetRoom.founder) {
			buffer.unshift((targetRoom.founder ? "Room Founder:\n" + ((Users(targetRoom.founder) && Users(targetRoom.founder).connected) ? RPC.nameColor(targetRoom.founder, true) : RPC.nameColor(targetRoom.founder)) : ''));
		}
		let curRoom = targetRoom;
		while (curRoom.parent) {
			const modjoinSetting = curRoom.modjoin === true ? curRoom.modchat : curRoom.modjoin;
			const roomType = (modjoinSetting ? `modjoin ${modjoinSetting} ` : '');
			const inheritedUserType = (modjoinSetting ? ` of rank ${modjoinSetting} and above` : '');
			if (curRoom.parent) {
				buffer.push(`${curRoom.title} is a ${roomType}subroom of ${curRoom.parent.title}, so ${curRoom.parent.title} users${inheritedUserType} also have authority in this room.`);
			}
			curRoom = curRoom.parent;
		}
		if (!curRoom.isPrivate) {
			buffer.push(`${curRoom.title} is a public room, so global auth with no relevant roomauth will have authority in this room.`);
		} else if (curRoom.isPrivate === 'hidden' || curRoom.isPrivate === 'voice') {
			buffer.push(`${curRoom.title} is a hidden room, so global auth with no relevant roomauth will have authority in this room.`);
		}
		if (targetRoom !== room) buffer.unshift("" + targetRoom.title + " room auth:");
		connection.send("|popup||html|" + buffer.join("\n\n") + userLookup);
	},
};

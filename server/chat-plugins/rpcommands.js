'use strict';

let allowed = true;
let lallowed = true;

exports.commands = {
	rpr: 'requestprivateroom',
	requestprivateroom(target, room, user) {
		if (!user.named) return this.errorReply(`You must choose a name before requesting to use a private rp room.`);
		if (!user.registered) return this.errorReply(`You must be registered before requesting to use a private rp room.`);
		if (!allowed) return this.errorReply(`Private rp rooms are currently not available to request.`);
		if (!this.can('broadcast')) return this.errorReply(`You may not host private rps unless you are a global voice or higher.`);

		target = target.split(',');
		if (target.length < 4) return this.parse('/help requestprivateroom');
		//RP Name, Room, estimated length, date

		let name = target[0];

		if (['1'].indexOf(toId(target[1])) === -1) return this.errorReply(`Please use the room identifier for the private room.`);
		let room1 = target[1];

		let length = parseInt(target[2]);
		if (isNaN(length)) {
			return this.errorReply("Length must be a number.");
		}

		let date = new Date(target[3]);

		RPC.messageSeniorStaff(`A user is requesting Private ${room1} for ${length} hours on ${date} for an RP named ${name}.`, `~RP Requests`, user.getIdentity());
		Rooms.rooms.get('upperstaff').add(`|c|~RP Requests|${user.getIdentity()} is requesting access to a private RP room. Refer to the PM for more details.`).update();
		this.sendReply(`Request sent successfully. Do not spam this request or it will be denied.`);
	},
	requestprivateroomhelp: ["/requestprivateroom <rpname>, <room>, <length (in hours)>, <date (in Month/Day/Year HH:MM:SS (Military) format (GMT-0400)> - Requests the usage of one of the RP rooms."],

	rl: 'requestlegend',
	requestlegend(target, room, user) {
		if (!user.named) return this.errorReply(`You must choose a name before requesting a legend perm.`);
		if (!this.can('broadcast')) return this.errorReply(`You msut hold at least Global Voice before you can request legends.`);
		if (!lallowed) return this.errorReply(`Legend requests are currently closed at this time.`);

		target = target.split(',');
		if (target.length < 3) return this.parse('/help requestlegend');

		let legend = target[0];
		let name = target[1];
		let doc = target[2];

		if (legend === "" || name === "" || doc === "") {
			return this.errorReply("You may not use blanks for any of the requirements of this command");
		}

		RPC.pmStaff(`A user is requesting a legend slot. Legend: ${legend}. Name: ${name}. Doc: ${doc}.`, `~Legend Request`, user.getIdentity());
		Rooms.rooms.get('staff').add(`|c|~Legend Request|${user.getIdentity()} has requested a legend.`).update();
		Rooms.rooms.get('staff').add(`|c|~Legend Request|${legend}, ${name}, ${doc}`).update();
		this.sendReply(`Your request has been sent. Do not spam this request or it will be denied.`);
	},
	requestlegendhelp: ["/requestlegend <legend>, <name>, <doc> - Sends a legend request to the staff. Please make sure that the legend name is spelled correctly and the doc is an actual link."],
};

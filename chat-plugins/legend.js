'use strict';

function resetLegend() {
	for (let i of Config.legendList) {
		Db.legend.set(i, "N/A");
		Db.legend2.set(i, "N/A");
		Db.legend3.set(i, "N/A");
		Db.legendDoc.set(i, "N/A");
		Db.legendDoc2.set(i, "N/A");
		Db.legendDoc3.set(i, "N/A");
	}
}

// This should never be called in anything other than other functions
function checkLegendName(a) {
	for (let i of Config.legendList) {
		if (a === i) {
			return true;
		}
	}
	return false;
}

function list1(legend, check) {
	check = parseInt(check);
	switch (check) {
	case 1:
		if (checkLegendName(legend)) {
			return Db.legend.get(legend) !== "N/A";
		} else {
			return "Wrong name";
		}
	case 2:
		return Db.legendDoc.get(legend) !== "N/A";
	default:
		throw new Error(`Unexpected check number: list1`);
	}
}

function list2(legend, check) {
	check = parseInt(check);
	switch (check) {
	case 1:
		if (checkLegendName(legend)) {
			return Db.legend2.get(legend) !== "N/A";
		} else {
			return "Wrong name";
		}
	case 2:
		return Db.legendDoc2.get(legend) !== "N/A";
	default:
		throw new Error(`Unexpected check number: list2`);
	}
}

function list3(legend, check) {
	check = parseInt(check);
	switch (check) {
	case 1:
		if (checkLegendName(legend)) {
			return Db.legend3.get(legend) !== "N/A";
		} else {
			return "Wrong name";
		}
	case 2:
		return Db.legendDoc3.get(legend) !== "N/A";
	default:
		throw new Error(`Unexpected check number: list3`);
	}
}

function userCheck(legend, user) {
	if (checkLegendName(legend)) {
		if (typeof user === 'object') user = user.userid;
		if (Db.legend.get(legend) === user) {
			return true;
		}
		if (Db.legend2.get(legend) === user) {
			return true;
		}
		if (Db.legend3.get(legend) === user) {
			return true;
		}
		return false;
	}
	return false;
}

function userCheckNum(user) {
	let number = 0;
	if (typeof user === 'object') user = user.userid;
	for (let i of Config.legendList) {
		if (Db.legend.get(i) === user) {
			number++;
		}
		if (Db.legend2.get(i) === user) {
			number++;
		}
		if (Db.legend3.get(i) === user) {
			number++;
		}
	}
	if (number === 3) {
		return true;
	}
	return false;
}

function writeLegend(legend, user) {
	if (checkLegendName(legend)) {
		if (typeof user === 'object') user = user.userid;
		if (userCheck(legend, user) || userCheckNum(user)) {
			return;
		}
		if (!list1(legend, 1)) {
			Db.legend.set(legend, user);
			return 1;
		}
		if (!list2(legend, 1)) {
			Db.legend2.set(legend, user);
			return 1;
		}
		if (!list3(legend, 1)) {
			Db.legend3.set(legend, user);
			return 1;
		}
	} else {
		return "Wrong name";
	}
}

function writeDoc(legend, doc) {
	if (!list1(legend, 2)) {
		Db.legendDoc.set(legend, doc);
		return 2;
	}
	if (!list2(legend, 2)) {
		Db.legend2.set(legend, doc);
		return 2;
	}
	if (!list3(legend, 2)) {
		Db.legend3.set(legend, doc);
		return 2;
	}
}

function check(legend) {
	if (checkLegendName(legend)) {
		return true;
	} else {
		return "Wrong name";
	}
}

function display(legend) {
	if (checkLegendName(legend)) {
		let display = `<center><psicon pokemon="${legend}"/> ${legend} <psicon pokemon="${legend}"/>`
		if (list1(legend, 1)) {
			display += `<br />1. ${Db.legend.get(legend)} `;
			display += `<a>${Db.legendDoc.get(legend)}</a><br />`;
		}
		if (list2(legend, 1)) {
			display += `<br />2. ${Db.legend2.get(legend)} `;
			display += `<a>${Db.legendDoc2.get(legend)}</a><br />`;
		}
		if (list3(legend, 1)) {
			display += `<br />3. ${Db.legend3.get(legend)} `;
			display += `<a>${Db.legendDoc3.get(legend)}</a><br />`;
		}
		if (!list1(legend, 1) && !list2(legend, 1) && !list3(legend, 1)) {
			display += `<br />No one has claimed this legend yet.`;
		}
		display += `</center>`;
		return display;
	}
}

exports.commands = {
	legend: function (target, room, user) {
		target = target.charAt(0).toUpperCase() + target.slice(1);
		if (list1(target, 1) && list2(target, 1) && list3(target, 1)) {
			this.errorReply(`That legend is no longer available.`);
		} else if (list1(target, 1) === `Wrong name`) {
			this.errorReply(`Please check your spelling of the legendary name.`);
		} else {
			this.sendReply(`The legend ${target} is available!`);
		}
	},

	displaylegend: function (target, room, user) {
		target = target.charAt(0).toUpperCase() + target.slice(1);
		if (check(target) === `Wrong name`) {
			return this.errorReply(`Please check your spelling of the legendary name.`);
		} else {
			this.sendReplyBox(display(target));
		}
	},

	listlegends: function (target, room, user) {
		let display = '';
		let colum = 0;
		for (let i of Config.legendList) {
			display += `<button class="button" name="send" value="/displaylegend ${i}">${i}</button> `;
			colum++;
			if (colum > 3) {
				display += "<br />";
				colum = 0;
			}
		}
		this.sendReplyBox(display);
	},

	forcereset: 'reset',
	reset: function (target, room, user, connection, cmd) {
		if (!this.can('rawpacket')) return false;
		if (cmd === "forcereset") {
			resetLegend();
			this.sendReply(`All legends have been reset.`);
			Rooms('lobby').addRaw(`<div class="broadcast-blue"><b>SERVER ANNOUNCEMENT</b><br/> A server admin has reset all legends. You must request your legend again if you would still like to have the legend perms.`).update();
		} else {
			return this.errorReply(`Because this is fairly destructive, you must confirm that you want to do this by using "/forcereset".`);
		}
	},

	setlegend: function (target, room, user) {
		if (!this.can('ban')) return false;
		target = target.split(", ");
		if (target.length < 3 || target.length > 3) {
			return this.parse("/help setlegend");
		}
		let legend = target[0];
		let userN = target[1];
		let doc = target[2];

		legend = legend.charAt(0).toUpperCase() + legend.slice(1);

		if (userCheckNum(userN)) {
			return this.errorReply(`That user already has three legends.`);
		}
		if (check(legend) === `Wrong name`) {
			return this.errorReply(`Are you sure you spelled the legend's name correctly?`);
		}

		writeLegend(legend, userN);
		writeDoc(legend, doc);

		this.parse(`/displaylegend ${legend}`);
	},
	setlegendhelp: [`/setlegend <legend>, <user>, <doc> - Sets the user owning one of the three slots of the legend. Requires @ * & ~`],

	removelegend: 'resetlegend',
	resetlegend: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		target = target.split(", ");
		if (target.length < 2 || target.length > 2) {
			return this.parse("/help resetlegend");
		}

		let legend = target[0];
		let page = target[1];

		page = parseInt(page);

		if (page > 3 || page < 1) {
			return this.errorReply(`The list number cannot be smaller than 1 or bigger than 3.`);
		}

		this.sendReply(`Attempting to remove the owner of legend ${legend} from the ${page} list.`);
		let done;
		switch (page) {
		case 1:
			this.sendReply("1");
			if (list1(legend, 1)) {
				Db.legend.set(legend, "N/A");
				Db.legendDoc.set(legend, "N/A");
				done = true;
				break;
			}
			break;
		case 2:
			this.sendReply("2");
			if (list2(legend, 1)) {
				Db.legend2.set(legend, "N/A");
				Db.legendDoc2.set(legend, "N/A");
				done = true;
				break;
			}
			break;
		case 3:
			this.sendReply("3");
			if (list3(legend, 1)) {
				Db.legend3.set(legend, "N/A");
				Db.legendDoc3.set(legend, "N/A");
				done = true;
				break;
			}
			break;
		}
		if (done) {
			this.sendReply(`Action successful.`);
			Rooms('staff').add(`|c|~Legend Request|${user.getIdentity()} has reset an entry for the legend ${legend}.`).update();
		} else {
			this.errorReply(`Action unsuccessful`);
		}
	},
	resetlegendhelp: [`/resetlegend <legend>, <list#> - Removes the owner and doc of the legend of the specific entry. Requires & ~`],
};

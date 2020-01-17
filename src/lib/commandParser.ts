const requireDir = require("require-dir")
const validCommands = requireDir('../src/lib/commands'); //TODO Change how commands are implemented

import { BaseCommand } from './commands/basecommand';

/**

Possible commands:

- move
- grab / pickup
- drop
- trow
- attack
- pull

*/

export class CommandParser {
	private command: BaseCommand;

	constructor(command) {
		this.command = command
	}


	normalizeAction(strAct) {
		strAct = strAct.toLowerCase().split(" ")[0];

		return strAct
	}


	verifyCommand() {
		if(!this.command) return false;
		if(!this.command.action) return false;
		if(!this.command.context) return false;

		let action = this.normalizeAction(this.command.action);

		if(validCommands[action]) {
			return validCommands[action]
		}
		return false
	}

	parse() {
		let validCommand = this.verifyCommand()
		if(validCommand) {
			const cmdObj = new validCommand(this.command);
			return cmdObj
		} else {
			return false
		}
	}

}

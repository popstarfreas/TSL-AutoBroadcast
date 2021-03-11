import Autobroadcast from "../../";
import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";

class AutobroadcastCommand extends CommandHandler {
    public names = ["autobc"];
    public permission = "autobroadcast.reload";
    private _autobroadcast: Autobroadcast;

    constructor(autobroadcast: Autobroadcast, commandHandlers: CommandHandlers) {
        super(commandHandlers);
        this._autobroadcast = autobroadcast;
    }

    public handle(command: Command, client: Client): void {
        this._autobroadcast.reload();
    }
}

export default AutobroadcastCommand;

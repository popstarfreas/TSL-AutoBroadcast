import Autobroadcast from "../../";
import Client from "../../../../client";
import Command from "../../../../command";
import CommandHandler from "../../../../commandhandler";
import CommandHandlers from "../../../../commandhandlers";

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

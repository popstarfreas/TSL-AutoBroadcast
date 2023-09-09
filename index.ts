import * as fs from "fs";
import TerrariaServer from "terrariaserver-lite/terrariaserver";
import Extension from "terrariaserver-lite/extensions/extension";

interface Broadcast {
    lines: string[];
    color: {
        R: number;
        G: number;
        B: number;
    };
    interval: number;
}

class Autobroadcast extends Extension {
    public name = "Autobroadcast";
    public version = "v1.2";
    public path = "";
    private _broadcasts: Broadcast[] = [];
    private _timers: NodeJS.Timeout[] = [];

    constructor(server: TerrariaServer) {
        super(server);
        this.loadCommands(__dirname);

        this.loadBroadcasts().then(() => {
            for (const broadcast of this.broadcasts) {
                this._timers.push(setInterval(() => {
                    for (const line of broadcast.lines) {
                        for (const client of this.server.clients) {
                            client.sendChatMessage(line, broadcast.color);
                        }
                    }
                }, broadcast.interval));
            }
        });
    }

    public get broadcasts(): Broadcast[] {
        return Object.assign(this._broadcasts);
    }

    public dispose(): void {
        super.dispose();
        for (const timer of this._timers) {
            clearInterval(timer);
        }
    }

    public async reload(): Promise<void> {
        for (const timer of this._timers) {
            clearInterval(timer);
        }

        await this.loadBroadcasts();
        for (const broadcast of this.broadcasts) {
            this._timers.push(setInterval(() => {
                for (const line of broadcast.lines) {
                    for (const client of this.server.clients) {
                        client.sendChatMessage(line, broadcast.color);
                    }
                }
            }, broadcast.interval));
        }
    }

    private async broadcastsFileExists(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.exists("../persistence/broadcasts.json", (exists) => {
                resolve(exists);
            });
        });
    }

    private async loadBroadcasts(): Promise<void> {
        if (await this.broadcastsFileExists()) {
            await this.loadBroadcastsFromFile();
        }
    }

    private async loadBroadcastsFromFile(): Promise<void> {
        const fileContents = await this.readBroadcastsFile();
        try {
            this._broadcasts = JSON.parse(fileContents);
        } catch (e) {
            console.log("Broadcasts could not be loaded from file.");
        }
    }

    private readBroadcastsFile(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile("../persistence/broadcasts.json", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }

    private saveBroadcasts(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile("../persistence/broadcasts.json", JSON.stringify(this._broadcasts), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

export default Autobroadcast;

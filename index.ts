import * as bcrypt from "bcrypt";
import PacketWriter from "dimensions/packets/packetwriter";
import PacketTypes from "dimensions/packettypes";
import * as fs from "fs";
import * as Winston from "winston";
import ChatMessage from "../../chatmessage";
import Client from "../../client";
import Database from "../../database";
import TerrariaServer from "../../terrariaserver";
import Extension from "../extension";

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
    public version = "v1.0";
    public path = "";
    private _broadcasts: Broadcast[] = [];
    private _timers: NodeJS.Timer[] = [];

    constructor(server: TerrariaServer) {
        super(server);
        this.loadBroadcasts();
        this.loadCommands(__dirname);

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

    public get broadcasts(): Broadcast[] {
        return Object.assign(this._broadcasts);
    }

    public dispose(): void {
        super.dispose();
        for (const timer of this._timers) {
            clearInterval(timer);
        }
    }

    public reload(): void {
        for (const timer of this._timers) {
            clearInterval(timer);
        }
        this.loadBroadcasts();
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
            fs.exists("../persistance/broadcasts.json", (exists) => {
                resolve(exists);
            });
        });
    }

    private async loadBroadcasts(): Promise<void> {
        if (await this.broadcastsFileExists()) {
            this.loadBroadcastsFromFile();
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
            fs.readFile("../persistance/broadcasts.json", (err, data) => {
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
            fs.writeFile("../persistance/broadcasts.json", JSON.stringify(this._broadcasts), (err) => {
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

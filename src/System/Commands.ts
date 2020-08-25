import { Trigger, MapPlayer } from "w3ts/index"

export class Commands {
    private _trg: Trigger;
    private _commands: Map<string, (text: string, args: string[]) => void>;

    public constructor() {
        this._trg = new Trigger()
        this._trg.addAction(() => {
            const rawCommand = GetEventPlayerChatString()
            if (rawCommand.startsWith('!')) {
                const args = rawCommand.split(' ')
                const command = args.shift()
                this.execute(command, args)
            }
        })
        this._commands = new Map<string, (text: string, args: string[]) => void>()

        this._trg.registerPlayerChatEvent(MapPlayer.fromLocal(), '!', false)
    }

    public command(command: string, action: (text: string, args: string[]) => void) {
        this._commands.set(command, action)
    }

    public execute(command: string, args: string[]) {
        if (this._commands.has(command)) {
            this._commands.get(command)(command, args)
        }
    }
}
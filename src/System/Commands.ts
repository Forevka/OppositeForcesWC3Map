import { Trigger, MapPlayer } from "w3ts/index"
import { State } from "State";

export class Commands {
    private _trg: Trigger;
    private _commands: Map<string, (text: string, args: string[]) => void>;
    private _synonyms: Map<string, string>;

    public constructor() {
        this._trg = new Trigger()
        this._trg.addAction(() => {
            const rawCommand = GetEventPlayerChatString()
            if (rawCommand.startsWith('!') || rawCommand.startsWith('-') || rawCommand.startsWith('.')) {
                const args = rawCommand.split(' ')
                const command = args.shift().slice(1)
                this.execute(command, args)
            }
        })
        this._commands = new Map<string, (text: string, args: string[]) => void>()
        this._synonyms = new Map<string, string>()

        this._trg.registerPlayerChatEvent(MapPlayer.fromLocal(), '!', false)
        this._trg.registerPlayerChatEvent(MapPlayer.fromLocal(), '-', false)
        this._trg.registerPlayerChatEvent(MapPlayer.fromLocal(), '.', false)
    }

    public synonym(originalCommand: string, synonym: string) {
        this._synonyms.set(synonym, originalCommand)
    }

    public command(command: string, action: (text: string, args: string[]) => void) {
        this._commands.set(command, action)
    }

    public execute(command: string, args: string[]) {
        command = command.toLowerCase()
        if (this._commands.has(command)) {
            this._commands.get(command)(command, args)
        } else {
            if (this._synonyms.has(command)) {
                const newCommand = this._synonyms.get(command)
                if (this._commands.has(newCommand)) {
                    this._commands.get(newCommand)(command, args)
                }
            }
        }
    }

    public registerCommands() {
        this.command('cam', (text: string, args: string[]) => {
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (args.length === 0) {
                    DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, `Please use this command like '|cffffff00!cam|r <distance>' e.g. '!cam 1280'.\nDefault value is 1650, minimal 500 maximal 4000`)
                } else {
                    let zoom = S2I(args[0])
                    if (zoom >= 500 && zoom <= 4000) {
                        SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, zoom, 1); 
                        DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, `Camera distance now |cffffff00${zoom}|r`);
                    } else {
                        DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, `Camera distance must be between 500 and 4000`);
                    }
                }
            }
        })

        this.synonym('cam', 'zoom')
        this.synonym('cam', 'z')
        this.synonym('cam', 'ящщь')
        this.synonym('cam', 'зум')
        this.synonym('cam', 'camera')
        this.synonym('cam', 'камера')
        this.synonym('cam', 'кам')
        this.synonym('cam', 'сфь')

        this.command('unit', (text: string, args: string[]) => {
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (args.length === 0) {
                    DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, `Example: -unit hfoo\nWill spawn footman at start position`)
                } else {
                    CreateUnit(GetTriggerPlayer(), FourCC(args[0]), GetPlayerStartLocationX(GetLocalPlayer()), GetPlayerStartLocationY(GetLocalPlayer()), 0)
                }
            }
        })

        this.synonym('unit', 'u')
        this.synonym('unit', 'у')

        this.command('state', (text: string, args: string[]) => {
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (args.length == 1) {
                    let id = S2I(args[0])
                    let desc = "Current state:"
                    desc += `\nGold: ${State[id].Income.Gold}, Wood: ${State[id].Income.Wood}, GL: ${State[id].Income.GoldLvl}, WL: ${State[id].Income.WoodLvl}`
                    DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, desc);
                }
            }
        })
    }
}
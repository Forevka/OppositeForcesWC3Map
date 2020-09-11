import { Trigger, MapPlayer } from "w3ts/index"
import { State } from "State";
import { SpawnSystem } from "../SpawnSystem";
import { Players } from "w3ts/globals/index";

export class Command {
    private owner: Commands;

    private _command: string;
    private _action: (this: Command, text: string, args: string[]) => void;

    public constructor(command: string, ownerPool: Commands) {
        this._command = command
        this.owner = ownerPool
    }

    public action(act: (this: Command, text: string, args: string[]) => void) {
        this._action = act
        return this
    }

    public synonym(synonyms: string[]) {
        synonyms.forEach((s) => {
            this.owner.synonym(this._command, s)
        })
        return this
    }

    public execute(command: string, args: string[]) {
        this._action(command, args)
    }
}

export class Commands {
    private _trg: Trigger;
    private _commands: Map<string, Command>;
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
        this._commands = new Map<string, Command>()
        this._synonyms = new Map<string, string>()

        Players.forEach(player => {
            this._trg.registerPlayerChatEvent(player, '!', false)
            this._trg.registerPlayerChatEvent(player, '-', false)
            this._trg.registerPlayerChatEvent(player, '.', false)
        });
    }

    public synonym(originalCommand: string, synonym: string) {
        this._synonyms.set(synonym, originalCommand)
    }

    public command(command: string) {
        let com = new Command(command, this)
        this._commands.set(command, com)
        return com;
    }

    private execute(command: string, args: string[]) {
        command = command.toLowerCase()
        if (this._commands.has(command)) {
            this._commands.get(command).execute(command, args)
        } else {
            if (this._synonyms.has(command)) {
                const newCommand = this._synonyms.get(command)
                if (this._commands.has(newCommand)) {
                    this._commands.get(newCommand).execute(command, args)
                }
            }
        }
    }
}

export function registerCommands() {
    let commandsPool = new Commands()
    commandsPool
        .command('cam')
        .action((text: string, args: string[]) => {
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
        .synonym(['zoom', 'z', 'camera', "ящщь", "зум", "камера", "кам", "сфь"])
    
    commandsPool
        .command('unit')
        .action((text: string, args: string[]) => {
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (args.length === 0) {
                    DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, `Example: -unit hfoo\nWill spawn footman at start position`)
                } else {
                    CreateUnit(GetTriggerPlayer(), FourCC(args[0]), GetPlayerStartLocationX(GetLocalPlayer()), GetPlayerStartLocationY(GetLocalPlayer()), 0)
                }
            }
        })
        .synonym(['u', 'юнит', 'у'])
    
    commandsPool
        .command('state')
        .action((text: string, args: string[]) => {
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (args.length == 1) {
                    let id = S2I(args[0])
                    let desc = "Current state:"
                    desc += `\nGold: ${State[id].Income.Gold}, Wood: ${State[id].Income.Wood}, GL: ${State[id].Income.GoldLvl}, WL: ${State[id].Income.WoodLvl}`
                    DisplayTimedTextToPlayer(GetLocalPlayer(), 0, 0, 60, desc);
                }
            }
        })

    commandsPool
        .command('spawn')
        .action((text: string, args: string[]) => {
            if (args.length == 1) {
                let teamId = S2I(args[0])
                if (teamId == 1 || teamId == 2) {
                    SpawnSystem.createUnits(teamId)
                }
            } else {
                SpawnSystem.createUnits(1)
                SpawnSystem.createUnits(2)
            }
        })
        .synonym(['sp', 'сп', 'спавн'])
}
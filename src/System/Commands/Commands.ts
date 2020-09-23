import { Trigger, MapPlayer, Quest, Unit } from "w3ts/index"
import { State } from "State";
import { SpawnSystem } from "../SpawnSystem";
import { Players } from "w3ts/globals/index";
import { Icons } from "Config";

export class Command {
    private owner: Commands;

    public description: string;
    public showInInfo: boolean;
    private _command: string;
    private _action: (this: Command, text: string, args: string[]) => void;

    public constructor(command: string, ownerPool: Commands, showInInfo: boolean) {
        this._command = command
        this.owner = ownerPool
        this.showInInfo = showInInfo
    }

    public action(act: (this: Command, text: string, args: string[]) => void) {
        this._action = act
        return this
    }

    public setDescription(descr: string) {
        this.description = descr
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

    public command(command: string, showInInfo: boolean) {
        let com = new Command(command, this, showInInfo)
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

    public createInfo() {
        let q = new Quest()
        q.setIcon(Icons.InfoBook)
        q.setDescription('Here you can find description of every command that map have|nAll commands can be called with (!,-,.) prefixes|nExample -zoom 2000 or !zoom 2000')
        q.setTitle('Commands')
        q.completed = true
        q.required = false

        this._commands.forEach((com: Command, key: string) => {
            if (com.showInInfo == true) {
                q.addItem(`${key} -> ${com.description}`)
            }
        })
    }
}

export function registerCommands() {
    let commandsPool = new Commands()
    commandsPool
        .command('cam', true)
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
        .setDescription("Camera zoom command")
    
    commandsPool
        .command('unit', false)
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
        .command('state', false)
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
        .command('spawn', false)
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
    
    
    commandsPool.createInfo()
}
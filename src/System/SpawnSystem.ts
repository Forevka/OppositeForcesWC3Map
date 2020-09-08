import { Timer, Unit, Trigger, Camera, Group } from "w3ts";
import { Units, Coords } from "Config";
import { SpawnConfig } from "Config/SpawnConfig";

export class SpawnSystem {
    private _time: number;
    private _maxTime: number;

    private _spawnIndex: number;
    private _maxSpawnIndex: number;

    private _delayBeforeStart: number;

    private _roundStarted: number; //0 - not started, 1 - started

    private _fTeamInfoTag: texttag;
    private _sTeamInfoTag: texttag;

    private _fTeamUnitGroup: Group;
    private _sTeamUnitGroup: Group;

    private _currentRound: number;

    public constructor(fTeamInfoTag: texttag, sTeamInfoTag: texttag) {
        this._currentRound = -1
        this._spawnIndex = -1

        this.nextRound()

        this._fTeamInfoTag = fTeamInfoTag
        this._sTeamInfoTag = sTeamInfoTag

        //this._fTeamUnitGroup = new Group()
        //this._sTeamUnitGroup = new Group()

        new Timer().start(1.00, true, () => {
            this.roundLogic()
        })
    }

    private nextRound() {
        this._currentRound += 1

        let roundInfo = SpawnConfig.get(this._currentRound)

        /*Count of spawns*/
        this._spawnIndex = -1
        this.nextSpawn()
        this._maxSpawnIndex = roundInfo.Spawns.length

        /*Delay before round start*/
        this._delayBeforeStart = roundInfo.Delay

        /*Round not started*/
        this._roundStarted = 0
    }

    private nextSpawn() {
        this._spawnIndex += 1
        let roundInfo = SpawnConfig.get(this._currentRound)
        /*Time between spawns*/
        this._maxTime = roundInfo.Spawns[this._spawnIndex].Cooldown//SpawnCooldown
        this._time = this._maxTime
    }

    private roundLogic() {
        if (this._roundStarted == 0) {
            this._delayBeforeStart -= 1
            if (this._delayBeforeStart > 0) {
                SetTextTagText(this._fTeamInfoTag, `Round ${this._currentRound + 1} start in ${this._delayBeforeStart}`, TextTagSize2Height(25))
                SetTextTagText(this._sTeamInfoTag, `Round ${this._currentRound + 1} start in ${this._delayBeforeStart}`, TextTagSize2Height(25))
                return
            } else {
                this._roundStarted = 1
                this._time += 1
            }
        }

        this._time -= 1
        if (this._time == 0) {
            SpawnSystem.createUnits(1)
            SpawnSystem.createUnits(2)

            if (this._spawnIndex + 1 >= this._maxSpawnIndex) {
                this.nextRound()
                SetTextTagText(this._fTeamInfoTag, `Round ${this._currentRound + 1} start in ${this._delayBeforeStart}`, TextTagSize2Height(25))
                SetTextTagText(this._sTeamInfoTag, `Round ${this._currentRound + 1} start in ${this._delayBeforeStart}`, TextTagSize2Height(25))
                return
            } else {
                this.nextSpawn()
            }


            this._time = this._maxTime
        }

        SetTextTagText(this._fTeamInfoTag, `Spawn ${this._spawnIndex + 1}/${this._maxSpawnIndex} in ${this._time}`, TextTagSize2Height(25))
        SetTextTagText(this._sTeamInfoTag, `Spawn ${this._spawnIndex + 1}/${this._maxSpawnIndex} in ${this._time}`, TextTagSize2Height(25))
    }

    public static createUnits(team: number) {
        xpcall(() => {
            let xxSpawn = 0
            let yySpawn = 0
            let rad = 0

            let xxBattle = 0
            let yyBattle = 0

            let xxToAttack = 0
            let yyToAttack = 0

            let controlPlayer = 0
            let facing = 0

            //let controlGroup: Group;

            if (team == 1) {
                xxSpawn = Coords.FTeamSpawn.x
                yySpawn = Coords.FTeamSpawn.y
                rad = Coords.FTeamSpawn.radius

                xxBattle = Coords.FTeamBattleSpawn.x
                yyBattle = Coords.FTeamBattleSpawn.y

                xxToAttack = Coords.STeamBattleSpawn.x
                yyToAttack = Coords.STeamBattleSpawn.y

                controlPlayer = 4
                facing = 180

                //controlGroup = this._fTeamUnitGroup
            } else {
                xxSpawn = Coords.STeamSpawn.x
                yySpawn = Coords.STeamSpawn.y
                rad = Coords.STeamSpawn.radius

                xxBattle = Coords.STeamBattleSpawn.x
                yyBattle = Coords.STeamBattleSpawn.y

                xxToAttack = Coords.FTeamBattleSpawn.x
                yyToAttack = Coords.FTeamBattleSpawn.y

                controlPlayer = 5
                facing = 0

                //controlGroup = this._sTeamUnitGroup
            }
            //const battleIndexer = BattleIndexer.Instance
            const loc = Location(xxSpawn, yySpawn);
            const units = GetUnitsInRangeOfLocAll(rad, loc);
            const size = BlzGroupGetSize(units);

            for (let i = 0; i < size; i++) {
                const unit = Unit.fromHandle(BlzGroupUnitAt(units, i));
        
                const relativeLocX = unit.x - xxSpawn
                const relativeLocY = unit.y - yySpawn

                if (unit.typeId === Units.SpawnRune || unit.typeId === Units.SpawnBattleTag) {
                    continue;
                }
                
                //print(`Unit: ${unit.name}; Team: ${team}`);
                let newUnit = Unit.fromHandle(CreateUnit(Player(controlPlayer), unit.typeId, xxBattle + relativeLocX, yyBattle + relativeLocY, facing))
                //newUnit.getField('qe')
                newUnit.color = GetPlayerColor(unit.owner.handle)
                //newUnit.name = I2S(newUnit.id)
                //controlGroup.addUnit(newUnit)
                /*battleIndexer.AddUnit(newUnit.id, {
                    owner: unit.owner.id, 
                    attackerId: null
                })*/
                //IssuePointOrderLocBJ(udg_AOEDamageSource, "attack", GetRectCenter(GetPlayableMapRect()))
                newUnit.issueOrderAt("attack", xxToAttack, yyToAttack)
            }

            //print(`control group ${team} len ${controlGroup.size}`)
            //controlGroup.orderImmediate("Stop")
            //controlGroup.orderCoords("Attack", xxToAttack, yyToAttack)
            //controlGroup.clear()
        }, print)
    }
}
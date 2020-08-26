import { Timer, Unit, Trigger, Camera } from "w3ts";
import { Units, Coords } from "Config";

export class SpawnSystem {
    private _time: number;
    private _maxTime: number;

    private _fTeamInfoTag: texttag;
    private _sTeamInfoTag: texttag;

    public constructor(fTeamInfoTag: texttag, sTeamInfoTag: texttag) {
        this._maxTime = 20
        this._time = this._maxTime

        this._fTeamInfoTag = fTeamInfoTag
        this._sTeamInfoTag = sTeamInfoTag

        new Timer().start(1.00, true, () => {
            this.spawn()
            SetTextTagText(this._fTeamInfoTag, `To spawn: ${this._time}`, TextTagSize2Height(25))
            SetTextTagText(this._sTeamInfoTag, `To spawn: ${this._time}`, TextTagSize2Height(25))
        })
    }

    private spawn() {
        this._time -= 1
        if (this._time == 0) {
            const loc = Location(Coords.FTeamSpawn.x, Coords.FTeamSpawn.y);
            const units = GetUnitsInRangeOfLocAll(Coords.FTeamSpawn.radius, loc);
            const size = BlzGroupGetSize(units);
        
            for (let i = 0; i < size; i++) {
              const unit = BlzGroupUnitAt(units, i);
              const unitId = GetUnitTypeId(unit)
        
              if (unitId === Units.SpawnRune || unitId === Units.SpawnBattleTag) {
                continue;
              }
              
              print(`Unit: ${GetUnitName(unit)}`);
            }

            this._time = this._maxTime
        }
    }
}
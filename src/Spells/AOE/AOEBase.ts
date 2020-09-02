import { Trigger, Group, Unit, MapPlayer, Widget } from "w3ts/index";
import { Units } from "Config";
import { SpellInfo } from "Spells/SpellInfo";
import { MyGroup } from "Extensions/MyGroup";

export class SpellAOEBase {
    private _info: SpellInfo;
    private _trigger: Trigger;
    private _castAction: (this: SpellAOEBase, dummyCaster: Unit, dummyOwner: MapPlayer, units: MyGroup, spellInfo: SpellInfo) => void;

    public constructor(info: SpellInfo) {
        this._info = info
        this._trigger = new Trigger()
    }

    public Init() {
        this._trigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT)
        this._trigger.addAction(() => {
            let spellId = GetSpellAbilityId()
            let spellLocation =  GetSpellTargetLoc()
            let dummyOwner = MapPlayer.fromEvent()
            let dummyCaster = new Unit(dummyOwner, Units.Dummy, GetLocationX(spellLocation), GetLocationY(spellLocation), 0)
            dummyCaster.x = GetLocationX(spellLocation)
            dummyCaster.y = GetLocationY(spellLocation)

            if (spellId == this._info.TriggerSpellId) {
                dummyCaster.addAbility(this._info.DummySpellId)
                dummyCaster.setAbilityLevel(this._info.DummySpellId, 1);
                this._castAction(dummyCaster, dummyOwner, MyGroup.fromHandle(GetUnitsInRangeOfLocAll(this._info.Range, spellLocation)), this._info)
            }
        })

        return this;
    }

    public SetAction(castAction: (this: SpellAOEBase, dummyCaster: Unit, dummyOwner: MapPlayer, units: MyGroup, spellInfo: SpellInfo) => void) {
        this._castAction = castAction;
    }
}

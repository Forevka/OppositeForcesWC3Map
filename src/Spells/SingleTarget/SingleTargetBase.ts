import { Trigger, Group, Unit, MapPlayer, Widget, Timer } from "w3ts/index";
import { Units } from "Config";
import { STSpellInfo } from "Spells/SpellInfo";

export class SingleTargetBase {
    private _info: STSpellInfo;
    private _trigger: Trigger;
    private _castAction: (this: SingleTargetBase, dummyCaster: Unit, dummyOwner: MapPlayer, unit: Unit, spellInfo: STSpellInfo) => void;

    public constructor(info: STSpellInfo) {
        this._info = info
        this._trigger = new Trigger()
    }

    public Init() {
        this._trigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_EFFECT)
        this._trigger.addAction(() => {
            xpcall(() => {
                let spellId = GetSpellAbilityId()
                let spellTarget = Unit.fromEvent()
                let dummyOwner = MapPlayer.fromEvent()
                let dummyCaster = new Unit(dummyOwner, this._info.DummyUnitId, spellTarget.x, spellTarget.y, 0)
                dummyCaster.x = spellTarget.x
                dummyCaster.y = spellTarget.y
    
                if (spellId == this._info.TriggerSpellId) {
                    dummyCaster.addAbility(this._info.DummySpellId)
                    dummyCaster.setAbilityLevel(this._info.DummySpellId, 1);
                    this._castAction(dummyCaster, dummyOwner, spellTarget, this._info)
                }
    
                let garbageDestroyer = new Timer().start(10, false, () => {
                    dummyCaster.destroy()
                    garbageDestroyer.destroy()
                })
            }, print)
        })

        return this;
    }

    public SetAction(castAction: (this: SingleTargetBase, dummyCaster: Unit, dummyOwner: MapPlayer, unit: Unit, spellInfo: STSpellInfo) => void) {
        this._castAction = castAction;
    }
}

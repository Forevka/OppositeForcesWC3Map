import { Trigger, Unit, Effect, Timer } from "w3ts/index";
import { Units } from "Config";
import { Abilities } from "Config/Abilities";

export class BurnDownEnemy {
    private _damageTrigger: Trigger;

    public constructor() {
        this._damageTrigger = new Trigger()
        this._damageTrigger.registerVariableEvent("udg_DamageModifierEvent", EQUAL, 1)
        this.registerAction()
    }

    private registerAction() {
        this._damageTrigger.addAction(() => {
            if (GetRandomInt(1, 100) <= 25) {
                let damageSource = Unit.fromHandle(udg_DamageEventSource)
                let damageTarget = Unit.fromHandle(udg_DamageEventTarget)
                
                if (damageTarget.isUnitType(UNIT_TYPE_STRUCTURE) == false
                && damageSource.getAbilityLevel(Abilities.DummyBurnDown) >= 1) {
                    let dummyCaster = new Unit(damageSource.owner, FourCC('h00B'), damageTarget.x, damageTarget.y, 0)
                    dummyCaster.addAbility(Abilities.BurnDown)
                    dummyCaster.setAbilityLevel(Abilities.BurnDown, 1);

                    dummyCaster.issueTargetOrder("attack", damageTarget)
                    let garbage = new Timer().start(1.5, false, () => {
                        dummyCaster.destroy()
                        garbage.destroy()
                    })
                }
            }
        })
    }
}
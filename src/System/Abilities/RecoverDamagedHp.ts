import { Trigger, Unit, Effect, Timer } from "w3ts/index";
import { Units } from "Config";
import { Abilities } from "Config/Abilities";
import { Color } from "Utils";
import { AbilityModel } from "Config/Models";

export class RecoverDamagedHp {
    private _damageTrigger: Trigger;

    public constructor() {
        this._damageTrigger = Trigger.fromHandle(gg_trg_DamageModifier)
        this.registerAction()
    }

    private registerAction() {
        this._damageTrigger.addAction(() => {
            if (GetRandomInt(1, 10) < 6) {
                let damageSource = Unit.fromHandle(udg_DamageEventSource)
                let damageTarget = Unit.fromHandle(udg_DamageEventTarget)
                
                if (damageTarget.isUnitType(UNIT_TYPE_STRUCTURE) == false
                && damageSource.getAbilityLevel(Abilities.BloodSwing) >= 1) {
                    let oldHp = damageSource.getState(UNIT_STATE_LIFE)
                    damageSource.setState(UNIT_STATE_LIFE, oldHp + udg_DamageEventAmount)
                    //ArcingTextTag(`${Color.GREEN}+${udg_DamageEventAmount}`, damageSource.handle)
                    let healEffect = new Effect(AbilityModel.VampiricHealHp, damageSource.x, damageSource.y)
                    let garbage = new Timer().start(2.0, false, () => {
                        healEffect.destroy()
                        garbage.destroy()
                    })
                }
            }
        })
    }
}
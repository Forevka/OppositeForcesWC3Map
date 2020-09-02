import { Trigger, Unit } from "w3ts/index";
import { UnitItemsView } from "View/UnitItemsView";

export class MovingUnitTakesBiggerDamage {
    public static init() {
        let trg = Trigger.fromHandle(gg_trg_DamageOnMovingUnit)
        trg.addAction(() => {
            let damageTarget = Unit.fromHandle(udg_DamageEventTarget)
            if (udg_UnitMoving[damageTarget.userData] == true) {
                udg_DamageEventAmount = udg_DamageEventAmount * 1.2
            }
        })
    }
}
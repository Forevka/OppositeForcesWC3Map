import { SingleTargetBase } from "./SingleTargetBase";
import { MapPlayer, Effect, Timer, Trigger, Unit } from "w3ts/index";
import { Abilities } from "Config/Abilities";
import { Units } from "Config";


export function orcChainingLightningT1() {
    new SingleTargetBase({
        DummyUnitId: Units.DummyOrcLightningCaster,
        TriggerSpellId: Abilities.DummyChainLightning,
        DummySpellId: Abilities.ChainLightning,
        DummySpellOrder: 'chainlightning',
    })
    .Init()
    .SetAction((dummyCaster, dummyOwner, realCaster, spellInfo) => {
        let target = Unit.fromHandle(GetSpellTargetUnit())
        dummyCaster.issueTargetOrder(spellInfo.DummySpellOrder, target)
    })

    let trg = new Trigger()//.fromHandle(gg_trg_StartEffectOfAnAbility)
    trg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED)
    trg.addAction(() => {
        let damageSource = Unit.fromHandle(GetEventDamageSource())
        if (damageSource.typeId == Units.DummyOrcLightningCaster) {
            let newCaster = new Unit(damageSource.owner, Units.Dummy, damageSource.x, damageSource.y, 0)
            print('lightning damage')
            newCaster.addAbility(Abilities.OrcPurge)
            newCaster.setAbilityLevel(Abilities.OrcPurge, 1)
            let damageTarget = Unit.fromEvent()
            print(damageTarget.name)
            newCaster.issueTargetOrder('purge', damageTarget)
            newCaster.destroy()
        }
    })
}
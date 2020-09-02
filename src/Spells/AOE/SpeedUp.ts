import { SpellAOEBase } from "./AOEBase";

export function speedUpAOESpell() {
    new SpellAOEBase({
        TriggerSpellId: FourCC('A003'),
        DummySpellId: FourCC('A009'),
        DummySpellOrder: 'cripple',
        Range: 350,//AOE RANGE FROM EDITOR
    })
    .Init()
    .SetAction((dummyCaster, dummyOwner, units, spellInfo) => {
        units.forEach((unit) => {
            if (unit.owner.isPlayerAlly(dummyOwner)) {
                dummyCaster.issueTargetOrder(spellInfo.DummySpellOrder, unit)
            }
        })
    })
}
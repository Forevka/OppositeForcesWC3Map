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
        print('WORKS')
        print(units.forEach)
        units.forEach((unit) => {
            print(unit.name)
            if (unit.owner.isPlayerAlly(dummyOwner)) {
                dummyCaster.issueTargetOrder(spellInfo.DummySpellOrder, unit)
            }
        })
    })
}
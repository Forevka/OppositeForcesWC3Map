import { SpellAOEBase } from "./AOEBase";
import { Timer } from "w3ts/index";

export function blizzardWithSlow() {
    new SpellAOEBase({
        TriggerSpellId: FourCC('A008'),
        DummySpellId: FourCC('A00B'),
        DummySpellOrder: 'cripple',
        Range: 400,//AOE RANGE FROM EDITOR
    })
    .Init()
    .SetAction((dummyCaster, dummyOwner, units, spellInfo) => {
        new Timer().start(0.6, false, () => {
            units.forEach((unit) => {
                if (!unit.owner.isPlayerAlly(dummyOwner)) {
                    dummyCaster.issueTargetOrder(spellInfo.DummySpellOrder, unit)
                }
            })
        })
    })
}
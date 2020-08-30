import { Trigger, Unit } from "w3ts/index";
import { BattleIndexer } from "Indexer/BattleIndexer";
import { TextTagWithFog } from "TextTag/TextTagWithFog";

let Color: string[] = [];

Color[0] = "|cffFF0202";
Color[1] = "|cff0041FF";
Color[2] = "|cff1BE5B8";
Color[3] = "|cff530080";
Color[4] = "|cffFFFC00";
Color[5] = "|cffFE890D";
Color[6] = "|cff1FBF00";
Color[7] = "|cffE45AAF";
Color[8] = "|cff949596";
Color[9] = "|cff7DBEF1";
Color[10] = "|cff0F6145";
Color[11] = "|cff4D2903";
Color[12] = "|c00252525";
Color[13] = "|c00252525";
Color[14] = "|c00252525";

export class DisplayDamage {
    public static Init() {
        let displayTrigger = new Trigger()
        let attachToUnit = new Trigger()

        displayTrigger.addAction(() => {
            let damager = GetEventDamageSource();
            let damaged = GetTriggerUnit();
            let damage = R2I(GetEventDamage() + 0.5);

            const battleIndexer = BattleIndexer.Instance
            const damagedUnitData = battleIndexer.GetUnitData(GetHandleId(damaged))
            const damagerUnitData = battleIndexer.GetUnitData(GetHandleId(damager))

            let text = Color[damagerUnitData.owner] + "-" + I2S(damage) + "|r";
            
            damagedUnitData.attackerId = GetHandleId(damager)

            TextTagWithFog(text, damaged, damager)
        })

        let world = CreateRegion()
        RegionAddRect(world, bj_mapInitialPlayableArea)
        attachToUnit.registerEnterRegion(world, null)
        attachToUnit.addAction(() => {
            displayTrigger.registerUnitEvent(Unit.fromHandle(GetTriggerUnit()), EVENT_UNIT_DAMAGED)
        })

        let g = CreateGroup()
        GroupEnumUnitsInRect(g, GetWorldBounds(), null)
        ForGroup(g, () => {
            displayTrigger.registerUnitEvent(Unit.fromHandle(GetEnumUnit()), EVENT_UNIT_DAMAGED)
        })

        DestroyGroup(g)
    }
}
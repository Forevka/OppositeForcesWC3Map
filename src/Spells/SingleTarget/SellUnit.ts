import { SingleTargetBase } from "./SingleTargetBase";
import { MapPlayer, Effect, Timer } from "w3ts/index";
import { Color } from "Utils";
import { TextTagVisibleToAlly } from "TextTag/TextTagWithFog";
import { AbilityModel } from "Config/Models";

//Selling this unit and returning 80% resources that was spent to buying
export function sellUnit() {
    new SingleTargetBase({
        TriggerSpellId: FourCC('A00E'),
        DummySpellId: 0,
        DummySpellOrder: '',
    })
    .Init()
    .SetAction((dummyCaster, dummyOwner, unit, spellInfo) => {
        let player = MapPlayer.fromEvent()
        
        if (!unit.isHero()) {
            let gCost = Math.round(GetUnitGoldCost(unit.typeId) * 0.8)
            let wCost = Math.round(GetUnitWoodCost(unit.typeId) * 0.8)

            let description = ''
            if (gCost != 0) {
                let currentGold = player.getState(PLAYER_STATE_RESOURCE_GOLD)
                player.setState(PLAYER_STATE_RESOURCE_GOLD, currentGold + gCost)
                //ArcingTextTag(`${Color.YELLOW}+${gCost*0.8}|r`, unit.handle)
                description += `${Color.YELLOW}+${gCost}|r|n`
            }

            if (wCost != 0) { 
                let currentWood = player.getState(PLAYER_STATE_RESOURCE_LUMBER)
                player.setState(PLAYER_STATE_RESOURCE_LUMBER, currentWood + wCost)
                //ArcingTextTag(`${Color.GREEN}+${wCost*0.8}|r`, unit.handle)
                description += `${Color.GREEN}+${wCost}|r|n`
            }

            TextTagVisibleToAlly(description, unit.handle, player)

            let e1 = new Effect(AbilityModel.DarkRitualTarget, unit.x, unit.y)
            let e2 = new Effect(AbilityModel.PileOfGold, unit.x, unit.y)
            let e3 = new Effect(AbilityModel.AlilTarget, unit.x, unit.y)
            unit.destroy()
            let t = new Timer().start(5, false, () => {
                e1.destroy()
                e2.destroy()
                e3.destroy()
                t.destroy()
            })
        }
    })
}
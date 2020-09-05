/*
Sells units through upgrade
*/

import { MapPlayer, Trigger, Unit } from "w3ts/index"
import { Upgrades } from "Config"

export class SellUnitSystem {
    public constructor() {
        let trg2 = new Trigger()
        trg2.registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH)
        trg2.addAction(() => {
            let player = MapPlayer.fromEvent()
            let target = Unit.fromEvent()
            let upgId = GetResearched()

            if (upgId == Upgrades.SellUnit) {
                if (!target.isHero()) {
                    let gCost = GetUnitGoldCost(target.typeId)
                    let wCost = GetUnitWoodCost(target.typeId)

                    let currentGold = player.getState(PLAYER_STATE_RESOURCE_GOLD)
                    let currentWood = player.getState(PLAYER_STATE_RESOURCE_LUMBER)

                    player.setState(PLAYER_STATE_RESOURCE_GOLD, currentGold + (gCost * 0.8))
                    player.setState(PLAYER_STATE_RESOURCE_LUMBER, currentWood + (wCost * 0.8))

                    target.destroy()
                }
            }
        })
    }
}
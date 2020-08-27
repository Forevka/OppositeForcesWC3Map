import { Trigger } from "w3ts/index"
import { Upgrades, UpgradesIncomeEffectsByLvl } from "Config"
import { UserState, State } from "State"

export class UpgradesLogic {
    
    constructor() {
        let trg = new Trigger()
        trg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH)
        trg.addAction(() => {
          this.onUpgrade()
        })
    }

    private onUpgrade() {
        let upgId = GetResearched()
        let player = GetTriggerPlayer()
        if (upgId == Upgrades.GoldIncome) {
            this.upgradedGoldIncome(player)
        } else if (upgId == Upgrades.WoodIncome) {
            this.upgradedWoodIncome(player)
        }
        
        print(`researched ${upgId}`)
    }

    private upgradedGoldIncome(player: player) {
        let state: UserState = State[GetPlayerId(player)]
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Gold[state.Income.GoldLvl]
        state.Income.GoldLvl += 1
        let oldIncome = state.Income.Gold
        state.Income.Gold += upgradeIncome

        DisplayTimedTextToPlayer(player, 0, 0, 100, `Gold income upgraded from ${oldIncome} to ${state.Income.Gold}`)
    }

    private upgradedWoodIncome(player: player) {
        let state: UserState = State[GetPlayerId(player)]
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Wood[state.Income.WoodLvl]
        state.Income.WoodLvl += 1
        let oldIncome = state.Income.Wood
        state.Income.Wood += upgradeIncome

        DisplayTimedTextToPlayer(player, 0, 0, 100, `Wood income upgraded from ${oldIncome} to ${state.Income.Wood}`)
    }
}
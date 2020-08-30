import { Trigger } from "w3ts/index"
import { Upgrades, UpgradesIncomeEffectsByLvl } from "Config"
import { UserState, State } from "State"
import { Color } from "Utils"

export class UpgradesLogic {
    private _callbackMap: Map<number, (player: player) => void>
    
    constructor() {
        let trg = new Trigger()
        trg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH)
        trg.addAction(() => {
          this.onUpgrade()
        })
        this._callbackMap = new Map<number, (player: player) => void>()
        this.setCallbacks()
    }

    private setCallbacks() {
        this._callbackMap.set(Upgrades.GoldIncome, this.upgradedGoldIncome)
        this._callbackMap.set(Upgrades.WoodIncome, this.upgradedWoodIncome)
        this._callbackMap.set(FourCC('R002'), this.upgradedKillIncome)
    }

    private onUpgrade() {
        let upgId = GetResearched()
        if (this._callbackMap.has(upgId)) {
            let player = GetTriggerPlayer()
            this._callbackMap.get(upgId)(player)
        }
        
        //print(`researched ${upgId}`)
    }

    private upgradedKillIncome(player: player) {
        let state: UserState = State[GetPlayerId(player)]
        state.Income.KillIncomeLvl += 1
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Kill[state.Income.KillIncomeLvl]
        let oldIncome = state.Income.KillIncome
        state.Income.KillIncome = upgradeIncome

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `Income for ${Color.RED}kills|r upgraded from ${Color.RED}${oldIncome}|r to ${Color.RED}${state.Income.KillIncome}|r`)
    }

    private upgradedGoldIncome(player: player) {
        let state: UserState = State[GetPlayerId(player)]
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Gold[state.Income.GoldLvl]
        state.Income.GoldLvl += 1
        let oldIncome = state.Income.Gold
        state.Income.Gold += upgradeIncome

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `${Color.YELLOW}Gold|r income upgraded from ${Color.YELLOW}${oldIncome}|r to ${Color.YELLOW}${state.Income.Gold}|r`)
    }

    private upgradedWoodIncome(player: player) {
        let state: UserState = State[GetPlayerId(player)]
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Wood[state.Income.WoodLvl]
        state.Income.WoodLvl += 1
        let oldIncome = state.Income.Wood
        state.Income.Wood += upgradeIncome

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `${Color.DARKGREEN}Wood|r income upgraded from ${Color.DARKGREEN}${oldIncome}|r to ${Color.DARKGREEN}${state.Income.Wood}|r`)
    }
}
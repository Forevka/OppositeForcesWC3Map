import { Trigger, MapPlayer} from "w3ts/index"
import { Upgrades, UpgradesIncomeEffectsByLvl, UnitsByTier } from "Config"
import { UserState, State } from "State"
import { Color } from "Utils"
import { UnitItemsView } from "View/UnitItemsView"
import { Players } from "w3ts/globals/index"

export class UpgradesLogic {
    private _callbackMap: Map<number, () => void>
    private _unitItemsView: UnitItemsView;
    
    constructor(unitItemsView: UnitItemsView) {
        this._unitItemsView = unitItemsView

        let trg = new Trigger()
        trg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_RESEARCH_FINISH)
        trg.addAction(() => {
          this.onUpgrade()
        })
        this._callbackMap = new Map<number, () => void>()
        this.setCallbacks()
    }

    private setCallbacks() {
        this._callbackMap.set(Upgrades.GoldIncome, this.upgradedGoldIncome)
        this._callbackMap.set(Upgrades.WoodIncome, this.upgradedWoodIncome)
        this._callbackMap.set(Upgrades.KillIncome, this.upgradedKillIncome)
    }

    private onUpgrade() {
        let upgId = GetResearched()
        let player = GetTriggerPlayer()
        print(`Upgrade by ${GetPlayerId(player)} ${GetPlayerName(player)} ${upgId}`)// GetTriggerPlayer()
        if (this._callbackMap.has(upgId)) {
            print('HAS UPG')
            let a = this._callbackMap.get(upgId)
            print(a)
            a()
        } else if (State[GetPlayerId(player)].Race.TierUpgrades.has(upgId)) {
            this.upgradedMainTier(player, upgId)
        }
        
        print(`researched ${upgId}`)
    }

    private upgradedMainTier(player: player, upgId: number) {
        let state: UserState = State[GetPlayerId(player)]
        let upgradedToTier = state.Race.TierUpgrades.get(upgId)
        state.Tier = upgradedToTier

        /*UnitsByTier.get(state.Race.Id).get(state.Tier).forEach((x) => {
            this._unitItemsView.addUnit(x)
        })
        this._unitItemsView.refresh()*/

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `You upgraded your main contract to ${upgradedToTier} tier.\nNow you able to train new units`)
    }

    private upgradedKillIncome() {
        let player = GetTriggerPlayer()
        let state: UserState = State[GetPlayerId(player)]
        state.Income.KillIncomeLvl += 1
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Kill[state.Income.KillIncomeLvl]
        let oldIncome = state.Income.KillIncome
        state.Income.KillIncome = upgradeIncome

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `Income for ${Color.RED}kills|r upgraded from ${Color.RED}${oldIncome}|r to ${Color.RED}${state.Income.KillIncome}|r`)
    }

    private upgradedGoldIncome() {
        let player = GetTriggerPlayer()
        print(`GOLD INCOME ${GetPlayerId(GetTriggerPlayer())}`)
        //if (GetPlayerId(GetLocalPlayer()) == GetPlayerId(player)) {
        print(`local`)
        let state: UserState = State[GetPlayerId(player)]
        print(state)
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Gold[state.Income.GoldLvl]
        print(`upgradeIncome ${upgradeIncome}`)
        state.Income.GoldLvl += 1
        let oldIncome = state.Income.Gold
        print(`oldIncome ${oldIncome}`)
        state.Income.Gold += upgradeIncome

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `${Color.YELLOW}Gold|r income upgraded from ${Color.YELLOW}${oldIncome}|r to ${Color.YELLOW}${state.Income.Gold}|r`)
        //}
    }


    private upgradedWoodIncome() {
        let player = GetTriggerPlayer()
        let state: UserState = State[GetPlayerId(player)]
        let upgradeIncome = UpgradesIncomeEffectsByLvl.Wood[state.Income.WoodLvl]
        state.Income.WoodLvl += 1
        let oldIncome = state.Income.Wood
        state.Income.Wood += upgradeIncome

        DisplayTextToPlayer(Player(GetPlayerId(player)), 0, 0, `${Color.DARKGREEN}Wood|r income upgraded from ${Color.DARKGREEN}${oldIncome}|r to ${Color.DARKGREEN}${state.Income.Wood}|r`)
    }
}
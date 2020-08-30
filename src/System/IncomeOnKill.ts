import { Trigger, Unit, MapPlayer } from "w3ts/index";
import { BattleIndexer } from "Indexer/BattleIndexer";
import { Color } from "Utils";
import { TextTagVisibleToAlly } from "TextTag/TextTagWithFog";
import { State } from "State";

export class IncomeOnKill {
    private _deathTrigger: Trigger;

    public constructor() {
        this._deathTrigger = new Trigger()
        this._deathTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH)
    }

    public static Init() {
        let ins = new IncomeOnKill()
        ins.OnDeath()
        return ins
    }

    private OnDeath() {
        this._deathTrigger.addAction(() => {
            xpcall(() => {
                let unit = Unit.fromEvent()
                let battleIndexer = BattleIndexer.Instance
                let unitData = battleIndexer.GetUnitData(unit.id)
                if (unitData != null) {
                    //let unitRealOwner = MapPlayer.fromIndex(unitData.owner)
                    //print(`OWNER ${unitRealOwner.name}`)
                    let killer = battleIndexer.GetUnitData(unitData.attackerId)
                    let killerOwner = MapPlayer.fromIndex(killer.owner)

                    if (!killerOwner.isPlayerAlly(MapPlayer.fromIndex(unitData.owner))) {
                        let killerState = State[killer.owner]
                        let oldGold = killerOwner.getState(PLAYER_STATE_RESOURCE_GOLD)
                        //let oldWood = killerOwner.getState(PLAYER_STATE_RESOURCE_LUMBER)

                        killerOwner.setState(PLAYER_STATE_RESOURCE_GOLD, oldGold + killerState.Income.KillIncome)
                        //killerOwner.setState(PLAYER_STATE_RESOURCE_GOLD, oldGold + 100)
                        let text = `${Color.YELLOW}+${killerState.Income.KillIncome}g|r`

                        TextTagVisibleToAlly(text, unit.handle, killerOwner)
                    }
                    battleIndexer.DeleteUnit(unit.id)
                }
            }, print)
        })
    }
}
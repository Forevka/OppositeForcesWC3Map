import { Trigger, Unit, MapPlayer } from "w3ts/index";
import { Color } from "Utils";
import { TextTagVisibleToAlly } from "TextTag/TextTagWithFog";
import { State } from "State";

export class IncomeOnKill {
    private _deathTrigger: Trigger;

    public constructor() {
        this._deathTrigger = Trigger.fromHandle(gg_trg_Prevent_Lethal)//new Trigger()
        //this._deathTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH)
    }

    public static Init() {
        let ins = new IncomeOnKill()
        ins.OnDeath()
        return ins
    }

    private OnDeath() {
        this._deathTrigger.addAction(() => {
            xpcall(() => {
                let diyingUnit = Unit.fromEvent()
                let killerUnit = Unit.fromHandle(udg_DamageEventSource)

                if (!killerUnit.owner.isPlayerAlly(diyingUnit.owner)) {
                    let killerState = State[killerUnit.owner.id]
                    let oldGold = killerUnit.owner.getState(PLAYER_STATE_RESOURCE_GOLD)

                    killerUnit.owner.setState(PLAYER_STATE_RESOURCE_GOLD, oldGold + killerState.Income.KillIncome)
                    let text = `${Color.YELLOW}+${killerState.Income.KillIncome}g|r`

                    TextTagVisibleToAlly(text, diyingUnit.handle, killerUnit.owner)
                }
            }, print)
        })
    }
}
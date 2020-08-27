import { Timer, Unit, Trigger, Camera } from "w3ts";
import { State, UserState } from "State";
import { PlayerForce } from "Utils";
import { IncomeView } from "View/IncomeView";

export class IncomeLogic {
    private _userState: UserState;
    private _incomeView: IncomeView;
    private _secondToIncome: number;
    private _maxSecondToIncome: number;

    public constructor(incomeView: IncomeView) {
        this._incomeView = incomeView

        this._maxSecondToIncome = 10
        this._secondToIncome = this._maxSecondToIncome

        this._userState = State[GetPlayerId(GetLocalPlayer())]

        new Timer().start(1, true, () => {
            this.update()
        })
    }

    public update() {
        this._secondToIncome -= 1

        if (this._secondToIncome == 0) {
            const l = GetLocalPlayer()

            const oldGold = GetPlayerState(l, PLAYER_STATE_RESOURCE_GOLD)
            const oldWood = GetPlayerState(l, PLAYER_STATE_RESOURCE_LUMBER)

            SetPlayerState(l, PLAYER_STATE_RESOURCE_GOLD, oldGold + this._userState.Income.Gold)
            SetPlayerState(l, PLAYER_STATE_RESOURCE_LUMBER, oldWood + this._userState.Income.Wood)

            DisplayTextToPlayer(l, 0,0, `Income:\n\n|c00FFFF00Gold|r ${this._userState.Income.Gold}\n|c0096FF96Wood|r ${this._userState.Income.Wood}`)

            this._secondToIncome = this._maxSecondToIncome
        }

        
        this._incomeView.update(this._secondToIncome)
    }
}
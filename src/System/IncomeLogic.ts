import { State } from "State";
import { PlayerForce } from "Utils";
import { IncomeView } from "View/IncomeView";

export class IncomeLogic {
    private _incomeState;
    private _incomeView: IncomeView;
    private _secondToIncome: number;
    private _maxSecondToIncome: number;

    public constructor(incomeView: IncomeView) {
        this._incomeView = incomeView

        this._maxSecondToIncome = 10
        this._secondToIncome = this._maxSecondToIncome

        if (PlayerForce() === 1) {
            this._incomeState = State.FTeam.Income
        } else {
            this._incomeState = State.STeam.Income
        }
    }

    public update() {
        this._incomeView.update(this._secondToIncome)
        this._secondToIncome -= 1

        if (this._secondToIncome > 0) {
            return null;
        }

        this._secondToIncome = this._maxSecondToIncome
        const l = GetLocalPlayer()

        const oldGold = GetPlayerState(l, PLAYER_STATE_RESOURCE_GOLD)
        const oldWood = GetPlayerState(l, PLAYER_STATE_RESOURCE_LUMBER)

        SetPlayerState(l, PLAYER_STATE_RESOURCE_GOLD, oldGold + this._incomeState.Gold)
        SetPlayerState(l, PLAYER_STATE_RESOURCE_LUMBER, oldWood + this._incomeState.Wood)

        DisplayTextToPlayer(l, 0,0, `Income:\n\n|c00FFFF00Gold|r ${this._incomeState.Gold}\n|c0096FF96Wood|r ${this._incomeState.Wood}`)
    }
}
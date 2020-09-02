import { Timer, Unit, Trigger, Camera, MapPlayer } from "w3ts";
import { State, UserState } from "State";
import { PlayerForce } from "Utils";
import { IncomeView } from "View/IncomeView";
import { Players } from "w3ts/globals/index";
import { UnitItemsView } from "View/UnitItemsView";

export class IncomeLogic {
    //private _userState: UserState;
    private _incomeView: IncomeView;
    private _secondToIncome: number;
    private _maxSecondToIncome: number;

    public constructor(incomeView: IncomeView) {
        this._incomeView = incomeView

        this._maxSecondToIncome = 10
        this._secondToIncome = this._maxSecondToIncome

        //this._userState = State[GetPlayerId(GetLocalPlayer())]

        new Timer().start(1, true, () => {
            this.update()
        })
    }

    public update() {
        this._secondToIncome -= 1

        if (this._secondToIncome == 0) {
            Players.forEach(x => {
                const oldGold = GetPlayerState(x.handle, PLAYER_STATE_RESOURCE_GOLD)
                const oldWood = GetPlayerState(x.handle, PLAYER_STATE_RESOURCE_LUMBER)

                x.setState(PLAYER_STATE_RESOURCE_GOLD, oldGold + State[x.id].Income.Gold)
                x.setState(PLAYER_STATE_RESOURCE_LUMBER, oldWood + State[x.id].Income.Wood)
                
                DisplayTextToPlayer(x.handle, 0,0, `Income:\n\n|c00FFFF00Gold|r ${State[x.id].Income.Gold}\n|c0096FF96Wood|r ${State[x.id].Income.Wood}`)
                UnitItemsView.Instance.refresh(x.id)
            })
            /*let l = MapPlayer.fromLocal()
            const oldGold = GetPlayerState(l.handle, PLAYER_STATE_RESOURCE_GOLD)
            const oldWood = GetPlayerState(l.handle, PLAYER_STATE_RESOURCE_LUMBER)

            l.setState(PLAYER_STATE_RESOURCE_GOLD, oldGold + State[l.id].Income.Gold)
            l.setState(PLAYER_STATE_RESOURCE_LUMBER, oldWood + State[l.id].Income.Wood)

            if (GetTriggerPlayer() == l.handle) {
                DisplayTextToPlayer(l.handle, 0,0, `Income:\n\n|c00FFFF00Gold|r ${State[l.id].Income.Gold}\n|c0096FF96Wood|r ${State[l.id].Income.Wood}`)
            }*/

            /*const oldGold = GetPlayerState(l, PLAYER_STATE_RESOURCE_GOLD)
            const oldWood = GetPlayerState(l, PLAYER_STATE_RESOURCE_LUMBER)

            SetPlayerState(l, PLAYER_STATE_RESOURCE_GOLD, oldGold + this._userState.Income.Gold)
            SetPlayerState(l, PLAYER_STATE_RESOURCE_LUMBER, oldWood + this._userState.Income.Wood)*/

            this._secondToIncome = this._maxSecondToIncome
        }

        
        this._incomeView.update(this._secondToIncome)
    }
}
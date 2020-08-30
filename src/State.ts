export interface UserState {
    Income: {
        Gold: number;
        Wood: number;
        GoldLvl: number;
        WoodLvl: number;
        KillIncome: number;
        KillIncomeLvl: number;
    }
}

export let State: UserState[] = []

for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    //Players[i] = MapPlayer.fromHandle(Player(i));
    State[i] = {
        Income: {
            Gold: 25,
            Wood: 15,
            GoldLvl: 0,
            WoodLvl: 0,
            KillIncome: 5,
            KillIncomeLvl: 0,
        }
    }
}

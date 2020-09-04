export const Objective = {
    1: {
        Description: "Win who last stay on battlefield",
    }
}

export type WaveConfig = {
    Cooldown: number;
}

export type RoundConfig = {
    Delay: number;
    Spawns: WaveConfig[];
    Objective: number;
}


export const SpawnConfig = new Map<number, RoundConfig>()
SpawnConfig.set(0, {
    Delay: 5,
    Spawns: [
        {
            Cooldown: 10
        },
        {
            Cooldown: 15
        },
        {
            Cooldown: 15
        },
        {
            Cooldown: 15
        },
        {
            Cooldown: 15
        },
        {
            Cooldown: 15
        },
    ],
    Objective: 1,
})

SpawnConfig.set(1, {
    Delay: 35,
    Spawns: [
        {
            Cooldown: 12
        },
        {
            Cooldown: 18
        },
    ],
    Objective: 1,
})

SpawnConfig.set(2, {
    Delay: 35,
    Spawns: [
        {
            Cooldown: 12
        },
        {
            Cooldown: 18
        },
    ],
    Objective: 1,
})


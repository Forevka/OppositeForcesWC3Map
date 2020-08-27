export const Units = {
    SpawnBattleTag: FourCC('n000'),
    SpawnRune: FourCC('n001'),

    Human: {
        Footman: FourCC('hfoo'),
        Knight: FourCC('hkni'),
        Rifleman: FourCC('hrif'),
        Priest: FourCC('hmpr'),
        Sorcer: FourCC('hsor'),
        AntiMage: FourCC('hspt'),
    },

    Orc: {
        Grunt: FourCC('ogru'),
        Raider: FourCC('orai'),
        Hunter: FourCC('ohun'),
        Kodo: FourCC('okod'),
        Shaman: FourCC('oshm'),
        Doctor: FourCC('odoc'),
    },

    Undead: {
        Ghoul: FourCC('ugho'),
        Abomination: FourCC('uabo'),
        Cryptfiend: FourCC('ucry'),
        Banshe: FourCC('uban'),
        Necromant: FourCC('unec'),
    },

    NightElf: {
        Archer: FourCC('earc'),
        Huntres: FourCC('esen'),
        Dryad: FourCC('edry'),
        DruidV: FourCC('edot'),
        DruidBear: FourCC('edoc'),
        DruidBearInForm: FourCC('edcm'),
        MoutainGiant: FourCC('emtg'),
    }
}

const MAIN_UPGRADE = 1378889776
function UpgradeOffset(offset: number) {
    return MAIN_UPGRADE + offset;
}

export const Upgrades = {
    GoldIncome: UpgradeOffset(0),
    WoodIncome: UpgradeOffset(1),
}

export const UpgradesIncomeEffectsByLvl = {
    Gold: {
        0: 50,
        1: 60,
        2: 100,
        3: 120,
        4: 130,
    },
    Wood: {
        0: 50,
        1: 75,
        2: 80,
        3: 100,
        4: 120,
        5: 150,
    },
}

export const Coords = {
    FTeamSpawn: {
        x: 1500,
        y: 2720,
        radius: 1000,
    },
    FTeamCreate: {
        x: 4060,
        y: 2123,
    },
    FTeamBattleSpawn: {
        x: -2620,
        y: 3600,
    },
    STeamSpawn: {
        x: 1375,
        y: -2780,
        radius: 1000,
    },
    STeamCreate: {
        x: 4060,
        y: -1903,
    },
    STeamBattleSpawn: {
        x: -2552,
        y: -3352,
    },
}
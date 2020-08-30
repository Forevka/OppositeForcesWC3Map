const MAIN_UPGRADE = 1378889776
function UpgradeOffset(offset: number) {
    return MAIN_UPGRADE + offset;
}

export const Upgrades = {
    GoldIncome: UpgradeOffset(0),
    WoodIncome: UpgradeOffset(1),
    KillIncome: UpgradeOffset(2),
    OrcT2: FourCC('R007'),
    OrcT3: FourCC('R008'),
    HumT2: FourCC('R004'),
    HumT3: FourCC('R005'),
}

export const Buildings = {
    OrcEmbassy: FourCC('h006'),
    HumanEmbassy: FourCC('h005'),
}

export const Units = {
    Dummy: FourCC('h003'), // DUMMY UNIT FOR ABILITY have invis and locust
    SpawnBattleTag: FourCC('n000'),
    SpawnRune: FourCC('n001'),

    Rogue: FourCC('nban'),
    SpearTrower: FourCC('nbrg'),

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

export const UnitsByTier = new Map<number, Map<number, number[]>>()
let startRace = new Map<number, number[]>()
startRace.set(0, [
    Units.Rogue,
    Units.SpearTrower,
])
UnitsByTier.set(1000, startRace)

let orcRace = new Map<number, number[]>()
orcRace.set(0, [
    Units.Orc.Grunt,
    Units.Orc.Hunter,
])
orcRace.set(1, [
    Units.Orc.Raider,
    Units.Orc.Shaman,
    Units.Orc.Doctor
])
orcRace.set(2, [
    Units.Orc.Kodo
])
UnitsByTier.set(0, orcRace)

let humRace = new Map<number, number[]>()
humRace.set(0, [
    Units.Human.Footman,
    Units.Human.Rifleman,
])
humRace.set(1, [
    Units.Human.AntiMage,
    Units.Human.Sorcer,
    Units.Human.Priest,
])
humRace.set(2, [
    Units.Human.Knight,
])
UnitsByTier.set(1, humRace)


let udRace = new Map<number, number[]>()
udRace.set(0, [
    Units.Undead.Ghoul,
    Units.Undead.Cryptfiend,
])
udRace.set(1, [
    Units.Undead.Banshe,
    Units.Undead.Necromant,
])
udRace.set(2, [
    Units.Undead.Abomination,
])
UnitsByTier.set(2, udRace)

let neRace = new Map<number, number[]>()
neRace.set(0, [
    Units.NightElf.Archer,
    Units.NightElf.Huntres,
])
neRace.set(1, [
    Units.NightElf.Dryad,
    Units.NightElf.DruidBear,
    Units.NightElf.DruidV,
])
neRace.set(2, [
    Units.NightElf.DruidBearInForm,
    Units.NightElf.MoutainGiant,
])
UnitsByTier.set(3, neRace)


export const RaceMap = {
    START: {
        Id: 1000,
        Name: 'Default race',
        TierUpgrades: new Map<number, number>(),
    },
    ORC: {
        Id: 0,
        Name: 'Orc race',
        TierUpgrades: new Map<number, number>(),
    },
    HUM: {
        Id: 1,
        Name: 'Human race',
        TierUpgrades: new Map<number, number>(),
    },
    UD: {
        Id: 2,
        Name: 'Undead race',
        TierUpgrades: new Map<number, number>(),
    },
    NE: {
        Id: 3,
        Name: 'NightElf',
        TierUpgrades: new Map<number, number>(),
    },
}

RaceMap.HUM.TierUpgrades.set(Upgrades.HumT2, 1)
RaceMap.HUM.TierUpgrades.set(Upgrades.HumT3, 2)

RaceMap.ORC.TierUpgrades.set(Upgrades.OrcT2, 1)
RaceMap.ORC.TierUpgrades.set(Upgrades.OrcT3, 2)


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
    Kill: {
        0: 5,
        1: 8,
        2: 12,
        3: 15,
        4: 19,
        5: 25,
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

let path = 'ReplaceableTextures\\CommandButtons\\'
export const Icons = {
    PhoenixEgg: path + 'BTNPhoenixEgg.blp'
}

export const CURRENT_VERSION = '0.0.5'
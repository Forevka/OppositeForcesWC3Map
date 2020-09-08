import { Abilities } from "Config/Abilities";

const MAIN_UPGRADE = 1378889776
function UpgradeOffset(offset: number) {
    return MAIN_UPGRADE + offset;
}

export const RaceEnum = {
    StartRace: 1000,
    Orc: 0,
    Human: 1,
    Undead: 2,
    NightElf: 3,
}

export const Upgrades = {
    GoldIncome: UpgradeOffset(0),
    WoodIncome: UpgradeOffset(1),
    KillIncome: UpgradeOffset(2),
    OrcT2: FourCC('R007'),
    OrcT3: FourCC('R008'),
    HumT2: FourCC('R004'),
    HumT3: FourCC('R005'),
    SellUnit: FourCC('R003'),
}

export const Buildings = {
    OrcEmbassy: FourCC('h006'),
    HumanEmbassy: FourCC('h005'),
}

export const TierBuildings = [
    Buildings.OrcEmbassy, Buildings.HumanEmbassy,
]

export const Units = {
    Dummy: FourCC('h003'), // DUMMY UNIT FOR ABILITY have invis and locust
    DummyOrcLightningCaster: FourCC('h00A'),
    SpawnBattleTag: FourCC('n000'),
    SpawnRune: FourCC('n001'),

    Rogue: FourCC('nban'),
    SpearTrower: FourCC('nbrg'),

    Human: {
        Footman: FourCC('h007'),
        Rifleman: FourCC('h008'),
        Mage1: FourCC('n005'),
        Archer: FourCC('n006'),
        Knight: FourCC('hkni'),
        Priest: FourCC('hmpr'),
        Sorcer: FourCC('hsor'),
        AntiMage: FourCC('hspt'),
    },

    Orc: {
        Grunt: FourCC('o001'),
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
UnitsByTier.set(RaceEnum.StartRace, startRace)

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
UnitsByTier.set(RaceEnum.Orc, orcRace)

let humRace = new Map<number, number[]>()
humRace.set(0, [
    Units.Human.Footman,
    Units.Human.Rifleman,
    Units.Human.Archer,
    Units.Human.Mage1,
])
humRace.set(1, [
    Units.Human.AntiMage,
    Units.Human.Sorcer,
    Units.Human.Priest,
])
humRace.set(2, [
    Units.Human.Knight,
])
UnitsByTier.set(RaceEnum.Human, humRace)


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
UnitsByTier.set(RaceEnum.Undead, udRace)

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
UnitsByTier.set(RaceEnum.NightElf, neRace)

export const SpellsByTier = new Map<number, Map<number, number[]>>()
let humSpells = new Map<number, number[]>()
humSpells.set(0, [
    Abilities.UnitRegeneration,
])
humSpells.set(1, [
    Abilities.BlizzardWithSlow,
])
humSpells.set(2, [
    
])

SpellsByTier.set(RaceEnum.Human, humSpells)

let orcSpells = new Map<number, number[]>()
orcSpells.set(0, [
    Abilities.BetterBloodlust,
])
orcSpells.set(1, [
    Abilities.HealingWave,
])
orcSpells.set(2, [
    
])

SpellsByTier.set(RaceEnum.Orc, orcSpells)

export const RaceMap = {
    START: {
        Id: 1000,
        Name: 'Default race',
        TierUpgrades: new Map<number, number>(),
        AbilityCasterSkin: 0,
    },
    ORC: {
        Id: 0,
        Name: 'Orc race',
        TierUpgrades: new Map<number, number>(),
        AbilityCasterSkin: FourCC('ovln')
    },
    HUM: {
        Id: 1,
        Name: 'Human race',
        TierUpgrades: new Map<number, number>(),
        AbilityCasterSkin: FourCC('hvlt')
    },
    UD: {
        Id: 2,
        Name: 'Undead race',
        TierUpgrades: new Map<number, number>(),
        AbilityCasterSkin: 1
    },
    NE: {
        Id: 3,
        Name: 'NightElf',
        TierUpgrades: new Map<number, number>(),
        AbilityCasterSkin: 1
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
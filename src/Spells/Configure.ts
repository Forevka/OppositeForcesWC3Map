import { speedUpAOESpell } from "./AOE/SpeedUp";
import { blizzardWithSlow } from "./AOE/BlizzardWithSlow";
import { sellUnit } from "./SingleTarget/SellUnit";
import { orcChainLightningT1 } from "./SingleTarget/OrcChainLightningT1";

export function registerSpells() {
    speedUpAOESpell()
    blizzardWithSlow()
    sellUnit()
    orcChainLightningT1()
}
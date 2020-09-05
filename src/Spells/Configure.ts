import { speedUpAOESpell } from "./AOE/SpeedUp";
import { blizzardWithSlow } from "./AOE/BlizzardWithSlow";
import { sellUnit } from "./SingleTarget/SellUnit";

export function registerSpells() {
    speedUpAOESpell()
    blizzardWithSlow()
    sellUnit()
}
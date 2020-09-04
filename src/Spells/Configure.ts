import { speedUpAOESpell } from "./AOE/SpeedUp";
import { blizzardWithSlow } from "./AOE/BlizzardWithSlow";

export function registerSpells() {
    speedUpAOESpell()
    blizzardWithSlow()
}
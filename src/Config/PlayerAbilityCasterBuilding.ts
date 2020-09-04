import { Unit, Timer } from "w3ts/index";
export let RedAbilityCasterBuilding: unit = gg_unit_h009_0156;
export let TealAbilityCasterBuilding: unit = gg_unit_h009_0155;
export let BlueAbilityCasterBuilding: unit = gg_unit_h009_0158;
export let PurpleAbilityCasterBuilding: unit = gg_unit_h009_0157;


export function GetAbilityCasterForPlayer(playerId: number) {
    if (Unit.fromHandle(gg_unit_h009_0156).owner.id == playerId) {
        return gg_unit_h009_0156
    } else if (Unit.fromHandle(gg_unit_h009_0155).owner.id == playerId) {
        return gg_unit_h009_0155
    } else if (Unit.fromHandle(gg_unit_h009_0158).owner.id == playerId) {
        return gg_unit_h009_0158
    } else if (Unit.fromHandle(gg_unit_h009_0157).owner.id == playerId) {
        return gg_unit_h009_0157
    }
}
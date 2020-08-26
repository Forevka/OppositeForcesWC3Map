import { PlayerTeam } from "System/TeamPlayer"

export function PlayerForce(): number {
    const l = GetLocalPlayer()
    return GetPlayerTeam(l)//PlayerTeam[GetPlayerId(l)]
}
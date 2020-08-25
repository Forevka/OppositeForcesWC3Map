import { PlayerTeam } from "System/TeamPlayer"

export function PlayerForce(): number {
    const l = GetLocalPlayer()
    return PlayerTeam[GetPlayerId(l)]
}
import { PlayerTeam } from "System/TeamPlayer"

export function PlayerForce(): number {
    const l = GetLocalPlayer()
    return GetPlayerTeam(l)//PlayerTeam[GetPlayerId(l)]
}

export const Color = {
    RED: "|cffff0000",
    BLUE: "|cff0000ff",
    TEAL: "|cff00f5ff",
    PURPLE: "|cff551A8B",
    YELLOW: "|cffffff00",
    ORANGE: "|cffEE9A00",
    GREEN: "|cff00CD00",
    PINK: "|cffFF69B4",
    GRAY: "|cffC0C0C0",
    LIGHBLUE: "|cffB0E2FF",
    DARKGREEN: "|cff006400",
    BROWN: "|cff8B4513",
}

export function ColorText(text: string, color: string) {
    return `${color}${text}|r`
}
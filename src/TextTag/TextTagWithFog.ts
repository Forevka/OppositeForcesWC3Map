import { MapPlayer } from "w3ts/index";

export function TextTagWithFog(text: string, damaged: unit, damager: unit) {
    let tt = CreateTextTag();

    /* text tag*/
    SetTextTagText(tt, text, 12 * 0.0023);
    SetTextTagPosUnit(tt, damaged, 20.);
    SetTextTagVelocity(tt, .05325 * Cos(1.570795), .05325 * Sin(1.570795));
    SetTextTagPermanent(tt, false);
    SetTextTagLifespan(tt, 1.5);
    SetTextTagFadepoint(tt, 0.);
    
    /* hide on fog of war */
    SetTextTagVisibility(tt, false);
    for (let i=0; i<16; i++) {
        if (GetPlayerController(Player(i)) == MAP_CONTROL_USER && GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING){
            if (IsUnitVisible(damager, Player(i)) && Player(i) == GetLocalPlayer()) {
                SetTextTagVisibility(tt, true);
            }
        }
    }
}

export function TextTagVisibleToAlly(text: string, damaged: unit, damagerOwner: MapPlayer) {
    let tt = CreateTextTag();

    /* text tag*/
    SetTextTagText(tt, text, 12 * 0.0023);
    SetTextTagPosUnit(tt, damaged, 20.);
    SetTextTagVelocity(tt, .05325 * Cos(1.570795), .05325 * Sin(1.570795));
    SetTextTagPermanent(tt, false);
    SetTextTagLifespan(tt, 1.5);
    SetTextTagFadepoint(tt, 0.);
    
    /* hide on fog of war */
    SetTextTagVisibility(tt, false);
    for (let i=0; i<16; i++) {
        if (GetPlayerController(Player(i)) == MAP_CONTROL_USER && GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING){
            if (damagerOwner.isPlayerAlly(MapPlayer.fromIndex(i))) {//(IsUnitVisible(damager, Player(i)) && Player(i) == GetLocalPlayer()) {
                SetTextTagVisibility(tt, true);
            }
        }
    }
}
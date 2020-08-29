import { Trigger, Unit } from "w3ts/index";

let Color: string[] = [];

Color[0] = "|cffFF0202";
Color[1] = "|cff0041FF";
Color[2] = "|cff1BE5B8";
Color[3] = "|cff530080";
Color[4] = "|cffFFFC00";
Color[5] = "|cffFE890D";
Color[6] = "|cff1FBF00";
Color[7] = "|cffE45AAF";
Color[8] = "|cff949596";
Color[9] = "|cff7DBEF1";
Color[10] = "|cff0F6145";
Color[11] = "|cff4D2903";
Color[12] = "|c00252525";
Color[13] = "|c00252525";
Color[14] = "|c00252525";

export class DisplayDamage {
    public static Init() {
        let displayTrigger = new Trigger()
        let attachToUnit = new Trigger()

        displayTrigger.addAction(() => {
            let uD = GetEventDamageSource();
            let uT = GetTriggerUnit();
            let pD = GetOwningPlayer(uD);
            let pT = GetOwningPlayer(uT);
            let tt = CreateTextTag();
            let d = R2I(GetEventDamage() + 0.5);
            let s = Color[GetPlayerId(pD)] + "-" + I2S(d) + "|r";
            
            /* text tag*/
            SetTextTagText(tt,s, 12 * 0.0023);
            SetTextTagPosUnit(tt, uT, 20.);
            SetTextTagVelocity(tt, .05325*Cos(1.570795), .05325*Sin(1.570795));
            SetTextTagPermanent(tt, false);
            SetTextTagLifespan(tt, 1.5);
            SetTextTagFadepoint(tt, 0.);
            
            /* hide on fog of war */
            SetTextTagVisibility(tt, false);
            for (let i=0; i<16; i++) {
                if (GetPlayerController(Player(i)) == MAP_CONTROL_USER && GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING){
                    if (IsUnitVisible(uD, Player(i)) && Player(i) == GetLocalPlayer()) {
                        SetTextTagVisibility(tt, true);
                    }
                }
            }
    
            /* leaks */
            uD = null;
            uT = null;
            pD = null;
            pT = null;
            tt = null;
        })

        let world = CreateRegion()
        RegionAddRect(world, bj_mapInitialPlayableArea)
        attachToUnit.registerEnterRegion(world, null)
        attachToUnit.addAction(() => {
            displayTrigger.registerUnitEvent(Unit.fromHandle(GetTriggerUnit()), EVENT_UNIT_DAMAGED)
        })

        let g = CreateGroup()
        GroupEnumUnitsInRect(g, GetWorldBounds(), null)
        ForGroup(g, () => {
            displayTrigger.registerUnitEvent(Unit.fromHandle(GetEnumUnit()), EVENT_UNIT_DAMAGED)
        })

        DestroyGroup(g)
    }
}
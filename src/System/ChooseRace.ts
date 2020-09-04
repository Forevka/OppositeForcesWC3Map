import { Trigger, Group, MapPlayer, Timer, Unit } from "w3ts/index"
import { Buildings, RaceMap, UnitsByTier, SpellsByTier } from "Config"
import { State } from "State"
import { UnitItemsView } from "View/UnitItemsView"
import { Abilities } from "Config/Abilities"

function PlayerHaveUnit(player: MapPlayer, unitId: number) {
    return Group.fromHandle(GetUnitsOfPlayerAndTypeId(player.handle, unitId)).size > 0
}

export class ChooseRace {
    public constructor(unitItemsView: UnitItemsView) {
        let timerRenewAbilityCasterAnimation = new Timer().start(1.0, true, () => {
            let redCaster = Unit.fromHandle(gg_unit_h009_0156)
            let blueCaster = Unit.fromHandle(gg_unit_h009_0158)
            let tealCaster = Unit.fromHandle(gg_unit_h009_0155)
            let purpleCaster = Unit.fromHandle(gg_unit_h009_0157)

            this.abilityCasterSet(redCaster)
            this.abilityCasterSet(blueCaster)
            this.abilityCasterSet(tealCaster)
            this.abilityCasterSet(purpleCaster)

            //print('che')
            //redCaster.setAnimation('birth')
        })

        let trg2 = new Trigger()
        trg2.registerAnyUnitEvent(EVENT_PLAYER_UNIT_UPGRADE_FINISH)
        trg2.addAction(() => {
            let player = MapPlayer.fromEvent()
            let isOrc = PlayerHaveUnit(player, Buildings.OrcEmbassy)
            let isHuman = PlayerHaveUnit(player, Buildings.HumanEmbassy)
            let race = RaceMap.START
            if (isOrc) {
                race = RaceMap.ORC
            } else if (isHuman) {
                race = RaceMap.HUM
            }

            let playerState = State[player.id]
            playerState.Race = race

            /*print(`race ${playerState.Race.id} ${playerState.Race.name} tier ${playerState.Tier}`)
            print(UnitsByTier.get(1).get(0))
            print(UnitsByTier.get(1).get(0).length)
            print(UnitsByTier.get(playerState.Race.id).get(playerState.Tier))
            print(UnitsByTier.get(playerState.Race.id).get(playerState.Tier).length)*/
            UnitsByTier.get(playerState.Race.Id).get(playerState.Tier).forEach((x) => {
                unitItemsView.addUnit(player.id, x)
            })
            unitItemsView.refresh(player.id)

            DisplayTextToPlayer(Player(player.id), 0, 0, `You signed contract with ${playerState.Race.Name}!\nNow you granted ability to train units of this race in right panel menu.`)
        })
    }

    private abilityCasterSet(abilityCasterBuilding: Unit) {
        if (State[abilityCasterBuilding.owner.id].Race.Id == 1000) {
            abilityCasterBuilding.setAnimation('birth')
        } else {
            abilityCasterBuilding.setAnimation('stand')
            abilityCasterBuilding.skin = State[abilityCasterBuilding.owner.id].Race.AbilityCasterSkin
            abilityCasterBuilding.removeAbility(Abilities.TutorialChooseRace)
            // adding to ability caster building all spells for ZERO tier
            SpellsByTier.get(State[abilityCasterBuilding.owner.id].Race.Id).get(0).forEach((x) => {
                abilityCasterBuilding.addAbility(x)
            })
        }
    }
}
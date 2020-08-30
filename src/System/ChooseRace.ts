import { Trigger, Group, MapPlayer } from "w3ts/index"
import { Buildings, RaceMap, UnitsByTier } from "Config"
import { State } from "State"
import { UnitItemsView } from "View/UnitItemsView"

function PlayerHaveUnit(player: MapPlayer, unitId: number) {
    return Group.fromHandle(GetUnitsOfPlayerAndTypeId(player.handle, unitId)).size > 0
}

export class ChooseRace {
    public constructor(unitItemsView: UnitItemsView) {
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
                unitItemsView.addUnit(x)
            })
            unitItemsView.refresh()

            DisplayTextToPlayer(Player(player.id), 0, 0, `You signed contract with ${playerState.Race.Name}!\nNow you granted ability to train units of this race in right panel menu.`)
        })
    }
}
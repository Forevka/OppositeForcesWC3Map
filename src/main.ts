import { Timer, Unit, Trigger, Camera, Quest, MapPlayer } from "w3ts";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Coords, Icons, CURRENT_VERSION, UnitsByTier } from "Config";
import { State } from "State";
import { PlayerForce } from "Utils";
import { IncomeView } from "View/IncomeView";
import { IncomeLogic } from "System/IncomeLogic";
import { Commands } from "System/Commands";
import { UnitItemsView } from "View/UnitItemsView";
import { SpawnSystem } from "System/SpawnSystem";
import { UpgradesLogic } from "System/Upgrades";
import { IncomeOnKill } from "System/IncomeOnKill";
import { ChooseRace } from "System/ChooseRace";
import { MovingUnitTakesBiggerDamage } from "System/MovingUnitTakeBiggerDamage";
import { registerSpells } from "Spells/Configure";
import { RedAbilityCasterBuilding } from "Config/PlayerAbilityCasterBuilding";


const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {

  /*const unit = new Unit(Players[0], FourCC("hfoo"), 0, 0, 270);
  unit.name = "TypeScript";

  new Timer().start(1.00, true, () => {
    unit.color = Players[math.random(0, bj_MAX_PLAYERS)].color
  });*/
  /*for (let i = 0; i < 16; i++) {
    const dir = Deg2Rad(360 - i * (360/12));
    CreateUnit(Player(GetPlayerNeutralPassive()), Units.SpawnRune, Coords.FTeamSpawn.x + Cos(-dir) * Coords.FTeamSpawn.radius, Coords.FTeamSpawn.y + Sin(-dir) * Coords.FTeamSpawn.radius, 0);
    CreateUnit(Player(GetPlayerNeutralPassive()), Units.SpawnRune, Coords.STeamSpawn.x + Cos(-dir) * Coords.STeamSpawn.radius, Coords.STeamSpawn.y + Sin(-dir) * Coords.STeamSpawn.radius, 0);
  }*/
  /*
    public OnClick(action: () => void) {
    const t = CreateTrigger();
    BlzTriggerRegisterFrameEvent(t, this._frame, FRAMEEVENT_CONTROL_CLICK);
    TriggerAddAction(t, action);
    return this;
    }
   */
  //
  
  //let state = State.FTeam


  let fTeamTextTag = CreateTextTagLocBJ('Spawn info', Location(Coords.FTeamSpawn.x, Coords.FTeamSpawn.y), 100, 25, 255,255,255,1)
  let sTeamTextTag = CreateTextTagLocBJ('Spawn info', Location(Coords.STeamSpawn.x, Coords.STeamSpawn.y), 100, 25, 255,255,255,1)

  let spawnSystem = new SpawnSystem(fTeamTextTag, sTeamTextTag)

  MovingUnitTakesBiggerDamage.init()

  /*if (PlayerForce() === 1) {
    state = State.FTeam
  } else {
    state = State.STeam
  }*/

  const mainFrame = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)

  const incomeView = new IncomeView()
  const incomeLogic = new IncomeLogic(incomeView)

  //const battleIndexer = BattleIndexer.Init()
  const incomeOnKill = IncomeOnKill.Init()

  new Timer().start(0.5, false, () => {
    incomeView.init()
    incomeView.update(10)
  })

  // get back shared unit control for 5 - yellow player(PC)
  MapPlayer.fromIndex(4).setAlliance(MapPlayer.fromIndex(0), ALLIANCE_SHARED_CONTROL, false) // red
  MapPlayer.fromIndex(4).setAlliance(MapPlayer.fromIndex(2), ALLIANCE_SHARED_CONTROL, false) // teal

  // also for 6 player(PC) orange
  MapPlayer.fromIndex(5).setAlliance(MapPlayer.fromIndex(1), ALLIANCE_SHARED_CONTROL, false) // blue
  MapPlayer.fromIndex(5).setAlliance(MapPlayer.fromIndex(3), ALLIANCE_SHARED_CONTROL, false) // purple

  ClearTextMessages()

  const commands = new Commands()
  commands.registerCommands()

  const BUILD_INFO = [
    `Build: ${BUILD_DATE}`,
    `Typescript: v${TS_VERSION}`,
    `Transpiler: v${TSTL_VERSION}`,
    `Version: v${CURRENT_VERSION}`
  ];

  let q = new Quest()
  q.setIcon(Icons.PhoenixEgg)
  q.setDescription('For any feedback feel free to email me\nzebestforevka@gmail.com or t.me/forevka')
  q.setTitle('Map build info')
  q.completed = true
  BUILD_INFO.forEach(x => q.addItem(x.trim()))
  

  let unitItemsView = UnitItemsView.Instance
  const chooseRace = new ChooseRace(unitItemsView)
  const upgradeLogic = new UpgradesLogic(unitItemsView)

  //DisplayDamage.Init()  

  ///DECLARE ALL SPELLS
  registerSpells()
  /* */
  new Timer().start(0.0, false, () => {
    unitItemsView.init()

    Players.forEach((p, i) => {
      UnitsByTier.get(1000).get(0).forEach((x) => {
        unitItemsView.addUnit(i, x)
      })

      unitItemsView.refresh(i)
    })

    /*unitItemsView.addUnit(FourCC("Hamg"))
    unitItemsView.addUnit(FourCC("Hblm"))
    unitItemsView.addUnit(FourCC("Hmkg"))
    unitItemsView.addUnit(FourCC("Hpal"))

    unitItemsView.addUnit(Units.Human.Footman)
    unitItemsView.addUnit(Units.Human.Rifleman)
    unitItemsView.addUnit(Units.Human.AntiMage)
    unitItemsView.addUnit(Units.Human.Knight)
    unitItemsView.addUnit(Units.Human.Priest)
    unitItemsView.addUnit(Units.Human.Sorcer)

    unitItemsView.addUnit(Units.Orc.Grunt)
    unitItemsView.addUnit(Units.Orc.Hunter)
    unitItemsView.addUnit(Units.Orc.Raider)
    unitItemsView.addUnit(Units.Orc.Kodo)
    unitItemsView.addUnit(Units.Orc.Doctor)
    unitItemsView.addUnit(Units.Orc.Shaman)

    unitItemsView.addUnit(Units.NightElf.Archer)
    unitItemsView.addUnit(Units.NightElf.Dryad)
    unitItemsView.addUnit(Units.NightElf.Huntres)
    unitItemsView.addUnit(Units.NightElf.DruidBear)
    unitItemsView.addUnit(Units.NightElf.DruidBearInForm)
    unitItemsView.addUnit(Units.NightElf.DruidV)
    unitItemsView.addUnit(Units.NightElf.MoutainGiant)

    unitItemsView.addUnit(Units.Undead.Ghoul)
    unitItemsView.addUnit(Units.Undead.Cryptfiend)
    unitItemsView.addUnit(Units.Undead.Abomination)
    unitItemsView.addUnit(Units.Undead.Banshe)
    unitItemsView.addUnit(Units.Undead.Necromant)*/

    /*unitItemsView.addItem(FourCC("ckng"))
    unitItemsView.addItem(FourCC("modt"))
    unitItemsView.addItem(FourCC("tkno"))
    unitItemsView.addItem(FourCC("ratf"))
    unitItemsView.addItem(FourCC("ofro"))
    unitItemsView.addItem(FourCC("desc"))
    unitItemsView.addItem(FourCC("fgdg"))
    unitItemsView.addItem(FourCC("infs"))
    unitItemsView.addItem(FourCC("shar"))
    unitItemsView.addItem(FourCC("sand"))
    unitItemsView.addItem(FourCC("wild"))
    unitItemsView.addItem(FourCC("srrc"))
    unitItemsView.addItem(FourCC("odef"))
    unitItemsView.addItem(FourCC("rde4"))
    unitItemsView.addItem(FourCC("pmna"))
    unitItemsView.addItem(FourCC("rhth"))
    unitItemsView.addItem(FourCC("ssil"))
    unitItemsView.addItem(FourCC("spsh"))
    unitItemsView.addItem(FourCC("sres"))
    unitItemsView.addItem(FourCC("pdi2"))
    unitItemsView.addItem(FourCC("pres"))
    unitItemsView.addItem(FourCC("totw"))
    unitItemsView.addItem(FourCC("fgfh"))
    unitItemsView.addItem(FourCC("fgrd"))
    unitItemsView.addItem(FourCC("fgrg"))
    unitItemsView.addItem(FourCC("hcun"))
    unitItemsView.addItem(FourCC("hval"))
    unitItemsView.addItem(FourCC("mcou"))
    unitItemsView.addItem(FourCC("ajen"))
    unitItemsView.addItem(FourCC("clfm"))
    unitItemsView.addItem(FourCC("ratc"))
    unitItemsView.addItem(FourCC("war2"))
    unitItemsView.addItem(FourCC("kpin"))
    unitItemsView.addItem(FourCC("lgdh"))
    unitItemsView.addItem(FourCC("ankh"))
    unitItemsView.addItem(FourCC("whwd"))
    unitItemsView.addItem(FourCC("fgsk"))
    unitItemsView.addItem(FourCC("wcyc"))
    unitItemsView.addItem(FourCC("hlst"))
    unitItemsView.addItem(FourCC("mnst"))
    unitItemsView.addItem(FourCC("belv"))
    unitItemsView.addItem(FourCC("bgst"))*/

    /*unitItemsView.addItem(FourCC("ciri"))
    unitItemsView.addItem(FourCC("lhst"))
    unitItemsView.addItem(FourCC("afac"))
    unitItemsView.addItem(FourCC("sbch"))
    unitItemsView.addItem(FourCC("brac"))
    unitItemsView.addItem(FourCC("rwiz"))
    unitItemsView.addItem(FourCC("pghe"))
    unitItemsView.addItem(FourCC("pgma"))
    unitItemsView.addItem(FourCC("pnvu"))
    unitItemsView.addItem(FourCC("sror"))
    unitItemsView.addItem(FourCC("woms"))
    unitItemsView.addItem(FourCC("crys"))
    unitItemsView.addItem(FourCC("evtl"))
    unitItemsView.addItem(FourCC("penr"))
    
    unitItemsView.refresh()*/
  })
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
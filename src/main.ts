import { Timer, Unit, Trigger, Camera } from "w3ts";
import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";
import { Units, Coords } from "Config";
import { State } from "State";
import { PlayerForce } from "Utils";
import { IncomeView } from "View/IncomeView";
import { IncomeLogic } from "System/IncomeLogic";
import { Commands } from "System/Commands";
import { UnitItemsView } from "View/UnitItemsView";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {
  print(`Build: ${BUILD_DATE}`);
  print(`Typescript: v${TS_VERSION}`);
  print(`Transpiler: v${TSTL_VERSION}`);
  print(" ");
  print("Welcome to TypeScript!");

  /*const unit = new Unit(Players[0], FourCC("hfoo"), 0, 0, 270);
  unit.name = "TypeScript";

  new Timer().start(1.00, true, () => {
    unit.color = Players[math.random(0, bj_MAX_PLAYERS)].color
  });*/
  for (let i = 0; i < 16; i++) {
    const dir = Deg2Rad(360 - i * (360/12));
    CreateUnit(Player(GetPlayerNeutralPassive()), Units.SpawnRune, Coords.FTeamSpawn.x + Cos(-dir) * Coords.FTeamSpawn.radius, Coords.FTeamSpawn.y + Sin(-dir) * Coords.FTeamSpawn.radius, 0);
    CreateUnit(Player(GetPlayerNeutralPassive()), Units.SpawnRune, Coords.STeamSpawn.x + Cos(-dir) * Coords.STeamSpawn.radius, Coords.STeamSpawn.y + Sin(-dir) * Coords.STeamSpawn.radius, 0);
  }
  /*
    public OnClick(action: () => void) {
    const t = CreateTrigger();
    BlzTriggerRegisterFrameEvent(t, this._frame, FRAMEEVENT_CONTROL_CLICK);
    TriggerAddAction(t, action);
    return this;
    }
   */
  //
  
  let state = State.FTeam

  if (PlayerForce() === 1) {
    state = State.FTeam
  } else {
    state = State.STeam
  }

  const mainFrame = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)

  new Timer().start(10.00, true, () => {
    const loc = Location(Coords.FTeamSpawn.x, Coords.FTeamSpawn.y);
    const units = GetUnitsInRangeOfLocAll(Coords.FTeamSpawn.radius, loc);
    const size = BlzGroupGetSize(units);

    for (let i = 0; i < size; i++) {
      const unit = BlzGroupUnitAt(units, i);
      const unitId = GetUnitTypeId(unit)

      if (unitId === Units.SpawnRune || unitId === Units.SpawnBattleTag) {
        continue;
      }
      
      print(`Unit: ${GetUnitName(unit)}`);
    }
  })

  const incomeView = new IncomeView()
  const incomeLogic = new IncomeLogic(incomeView)

  new Timer().start(0.5, false, () => {
    incomeView.init()
    incomeView.update(10)
  })

  new Timer().start(1, true, () => {
    incomeLogic.update()
  })

  const commands = new Commands()
  commands.command('!test', (text: string, args: string[]) => {
    print('test works ok')
    print(text)
  })

  commands.command('!gg', (text: string, args: string[]) => {
    print('GG')
  })

  commands.command('!cam', (text: string, args: string[]) => {
    print(text)
    if (args.length === 0) {
      DisplayTextToPlayer(GetLocalPlayer(), 0, 0, `Please use this command like '!cam <distance>' e.g. '!cam 1280'.\nDefault value is 1650`)
    } else {
      print('zoom')
      
    }
  })

  let unitItemsView = UnitItemsView.Instance

  new Timer().start(0.0, false, () => {

    unitItemsView.addUnit(FourCC("Hamg"))
    unitItemsView.addUnit(FourCC("Hblm"))
    unitItemsView.addUnit(FourCC("Hmkg"))
    unitItemsView.addUnit(FourCC("Hpal"))
    unitItemsView.addUnit(FourCC("hbot"))
    unitItemsView.addUnit(FourCC("hbsh"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("hdes"))
    unitItemsView.addUnit(FourCC("Hmkg"))
    unitItemsView.addUnit(FourCC("Hmkg"))
    unitItemsView.addUnit(FourCC("Hmkg"))
    unitItemsView.addUnit(FourCC("Hmkg"))

    unitItemsView.addItem(FourCC("ckng"))
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
    unitItemsView.addItem(FourCC("bgst"))
    unitItemsView.addItem(FourCC("ciri"))
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
    
    unitItemsView.refresh()
  })
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
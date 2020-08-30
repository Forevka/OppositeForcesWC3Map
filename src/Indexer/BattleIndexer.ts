import { Trigger, Unit } from "w3ts/index";

declare type IndexState = {
    owner: number;
    attackerId: number; 
}

export class BattleIndexer {
    static _instance: BattleIndexer;

    public _indexTable: Map<number, IndexState>;
    private _deathTrigger: Trigger;

    public constructor() {
        this._indexTable = new Map<number, IndexState>()
        this._deathTrigger = new Trigger()
        this._deathTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH)
        //this.DeathTrigger()
    }

    public AddUnit(unitId: number, state: IndexState) {
        this._indexTable.set(unitId, state)
    }

    public DeleteUnit(unitId: number) {
        this._indexTable.delete(unitId)
    }

    private DeathTrigger() {
        this._deathTrigger.addAction(() => {
            let unit = Unit.fromEvent()
        })
    }

    public static Init() {
        let ins = BattleIndexer.Instance
        return ins
    }

    public static get Instance() {
        if (BattleIndexer._instance == null) {
            BattleIndexer._instance = new BattleIndexer()
        }

        return BattleIndexer._instance
    }

    public GetUnitData(unitId: number): IndexState {
        if (this._indexTable.has(unitId))
        {
            return this._indexTable.get(unitId);
        }
        return null
    }
}
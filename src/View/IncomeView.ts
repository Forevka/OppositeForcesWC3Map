import { State, UserState } from "State";
import { Players } from "w3ts/globals/index";

export class IncomeView {
    private _userState: UserState;

    private _multiBoards: multiboard[];
    private _multiFrames: framehandle[];
    private _multiContainers: framehandle[];
    private _itemGoldLabels: multiboarditem[];
    private _itemWoodLabels: multiboarditem[];
    private _itemGoldValues: multiboarditem[];
    private _itemWoodValues: multiboarditem[];

    public constructor() {
        this._multiBoards = []
        this._multiContainers = []
        this._multiFrames = []

        this._itemWoodLabels = []
        this._itemWoodValues = []

        this._itemGoldLabels = []
        this._itemGoldValues = []
    }

    public init() {
        let index = 0
        Players.forEach(x => {
            //print(index)
            this.createTable(index)
            index += 1
        })
    }

    private createTable(index: number) {
        xpcall(() => {
            this._multiBoards[index] = CreateMultiboardBJ(2, 2, "Income")
            this._multiFrames[index] = BlzGetFrameByName("Multiboard", 0)
            this._multiContainers[index] = BlzGetFrameByName("MultiboardListContainer",0)
    
            MultiboardSetItemsStyle(this._multiBoards[index], true, false)
            MultiboardSetItemsWidth(this._multiBoards[index], 0.10)
            MultiboardMinimize(this._multiBoards[index], false)

            BlzFrameSetVisible(this._multiFrames[index], false)
        
            this._itemGoldLabels[index] = MultiboardGetItem(this._multiBoards[index], 0, 0)
            MultiboardSetItemValue(this._itemGoldLabels[index], 'Gold')
    
            this._itemWoodLabels[index] = MultiboardGetItem(this._multiBoards[index], 0, 1)
            MultiboardSetItemValue(this._itemWoodLabels[index], 'Wood')
    
            this._itemGoldValues[index] = MultiboardGetItem(this._multiBoards[index], 1, 0)
            this._itemWoodValues[index] = MultiboardGetItem(this._multiBoards[index], 1, 1)
    
            BlzFrameClearAllPoints(this._multiFrames[index])
            BlzFrameSetPoint(this._multiFrames[index], FRAMEPOINT_TOP, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOPRIGHT, 0.0, -0.05)
            BlzFrameSetSize(this._multiFrames[index], 0.03, 0.03)
        
            if (Player(index) == GetLocalPlayer())
            {
                BlzFrameSetVisible(this._multiFrames[index], true)
            }
        }, print)
    }

    public update(secondLeft: number) {
        let index = 0
        Players.forEach(x => {
            if (GetPlayerId(GetLocalPlayer()) == index) {
                let state = State[index]
                //print(`Income in ${secondLeft} for ${index}`)
                BlzFrameSetVisible(this._multiFrames[index], true)
                MultiboardSetItemValue(this._itemGoldValues[index], `${state.Income.Gold}`)
                MultiboardSetItemValue(this._itemWoodValues[index], `${state.Income.Wood}`)
                MultiboardSetTitleText(this._multiBoards[index], `Income in ${secondLeft} for ${index}`)
            }
            index += 1
        })
    }
}

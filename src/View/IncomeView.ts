import { State, UserState } from "State";

export class IncomeView {
    private _userState: UserState;

    private _multiBoard: multiboard;
    private _multiFrame: framehandle;
    private _multiContainer: framehandle;
    private _itemGoldLabel: multiboarditem;
    private _itemWoodLabel: multiboarditem;
    private _itemGoldValue: multiboarditem;
    private _itemWoodValue: multiboarditem;

    public constructor() {
        /*if (PlayerForce() === 1) {
            this._incomeState = State.FTeam.Income
        } else {
            this._incomeState = State.STeam.Income
        }*/
        this._userState = State[GetPlayerId(GetLocalPlayer())]
    }

    public init() {
        this._multiBoard = CreateMultiboardBJ(2, 2, "Income")
        this._multiFrame = BlzGetFrameByName("Multiboard", 0)
        this._multiContainer = BlzGetFrameByName("MultiboardListContainer",0)

        MultiboardSetItemsStyle(this._multiBoard, true, false)
        MultiboardSetItemsWidth(this._multiBoard, 0.10)
        MultiboardMinimize(this._multiBoard, false)
    
        this._itemGoldLabel = MultiboardGetItem(this._multiBoard, 0, 0)
        MultiboardSetItemValue(this._itemGoldLabel, 'Gold')

        this._itemWoodLabel = MultiboardGetItem(this._multiBoard, 0, 1)
        MultiboardSetItemValue(this._itemWoodLabel, 'Wood')

        this._itemGoldValue = MultiboardGetItem(this._multiBoard, 1, 0)
        this._itemWoodValue = MultiboardGetItem(this._multiBoard, 1, 1)

        BlzFrameClearAllPoints(this._multiFrame)
        BlzFrameSetPoint(this._multiFrame, FRAMEPOINT_TOP, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOPRIGHT, 0.0, -0.05)
        BlzFrameSetSize(this._multiFrame, 0.03, 0.03)
    
        BlzFrameSetVisible(this._multiFrame, true)
    }

    public update(secondLeft: number) {
        MultiboardSetItemValue(this._itemGoldValue, `${this._userState.Income.Gold}`)
        MultiboardSetItemValue(this._itemWoodValue, `${this._userState.Income.Wood}`)
        MultiboardSetTitleText(this._multiBoard, `Income in ${secondLeft} for ${GetPlayerId(GetLocalPlayer())}`)
    }
}

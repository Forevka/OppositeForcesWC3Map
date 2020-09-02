import { Coords } from "Config";
import { Force, MapPlayer } from "w3ts/index";
import { Players } from "w3ts/globals/index";

export class UnitItemsView {
    private _boxes: framehandle[];
    private _button: framehandle[];
    private _hideButton: framehandle[];

    private _buttonBox: framehandle[];

    private _frameA: framehandle[];
    private _frameB: framehandle[];

    private _unitList: tasobject[];
    private _itemList: tasobject[];
    
    private _isUnitsShow: boolean[];
    private _isItemsShow: boolean[];
    private _isHided: boolean[];

    public static _instance: UnitItemsView;

    public constructor() {
        this._boxes = [];
        this._button = [];
        this._hideButton = [];

        this._buttonBox = [];

        this._frameA = [];
        this._frameB = [];

        this._unitList = [];
        this._itemList = [];
        
        this._isUnitsShow = [];
        this._isItemsShow = [];
        this._isHided = [];
    }

    public init() {
        Players.forEach((x, i) => {
            this.createView(i)
        })
    }

    private createView(index: number) {
        this._isUnitsShow[index] = true
        this._isItemsShow[index] = false
        
        this._isHided[index] = true

        this._boxes[index] = BlzCreateFrame("EscMenuBackdrop", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
        BlzFrameSetSize(this._boxes[index] , 0.255, 0.26)
        BlzFrameSetAbsPoint(this._boxes[index] , FRAMEPOINT_TOPRIGHT, 0.80, 0.46)

        this._button[index]  = BlzCreateFrameByType("GLUETEXTBUTTON", "", this._boxes[index] , "ScriptDialogButton",0)
        BlzFrameSetAbsPoint(this._button[index] , FRAMEPOINT_TOPRIGHT, 0.78, 0.48)
        BlzFrameSetSize(this._button[index] , 0.1, 0.03)
        BlzFrameSetText(this._button[index] , "To items")

        this._hideButton[index]  = BlzCreateFrameByType("GLUETEXTBUTTON", "", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), "ScriptDialogButton",0)
        BlzFrameSetAbsPoint(this._hideButton[index] , FRAMEPOINT_TOPRIGHT, 0.67, 0.48)
        BlzFrameSetSize(this._hideButton[index] , 0.1, 0.03)
        BlzFrameSetText(this._hideButton[index] , "Hide")

        this._frameA[index] = BlzCreateFrameByType("FRAME", "", this._boxes[index] , "",0)
        BlzFrameSetSize(this._frameA[index] , 0.23, 0.001)
        //BlzFrameSetAbsPoint(frameA, FRAMEPOINT_TOPRIGHT, 0.78, 0.54)
        BlzFrameSetPoint(this._frameA[index] , FRAMEPOINT_TOPLEFT, this._boxes[index] , FRAMEPOINT_TOPLEFT, 0, -0.02)
        BlzFrameSetVisible(this._frameB[index] , this._isUnitsShow[index] )

        this._frameB[index] = BlzCreateFrameByType("FRAME", "", this._boxes[index], "",0)
        BlzFrameSetSize(this._frameB[index] , 0.23, 0.001)
        // BlzFrameSetAbsPoint(frameB, FRAMEPOINT_TOPRIGHT, 0.78, 0.54)
        BlzFrameSetPoint(this._frameB[index] , FRAMEPOINT_TOPLEFT, this._boxes[index], FRAMEPOINT_TOPLEFT, 0, -0.02)
        BlzFrameSetVisible(this._frameB[index] , this._isItemsShow[index])

        if (GetPlayerId(GetLocalPlayer()) != GetPlayerId(Player(index))) {
            BlzFrameSetVisible(this._boxes[index], false)
            BlzFrameSetVisible(this._frameB[index], false)
            BlzFrameSetVisible(this._frameB[index], false)
        }

        this.changeFrameTrigger(index)
        this.hideTrigger(index)

        this.createUnitList(index)
        this.createItemList(index)
    }

    public static get Instance() {
        if (UnitItemsView._instance == null) {
            UnitItemsView._instance = new UnitItemsView()
            UnitItemsView._instance.init()
        }

        return UnitItemsView._instance
    }

    public addUnit(index:number, id: number) {
        TasButtonListAddData(this._unitList[index], id)
    }

    public addItem(index: number, id: number) {
        UnitItemsView.AddItemAndGetCost(this._itemList[index], id)
    }

    public refresh(index: number) {
        BlzFrameSetValue(this._unitList[index].Slider, 999999)
        BlzFrameSetValue(this._itemList[index].Slider, 999999)
    }

    private changeFrameTrigger(index: number) {
        let trigger = CreateTrigger()
        TriggerAddAction(trigger, function() {
            //let playerId = GetPlayerId(GetLocalPlayer())
            BlzFrameSetEnable(BlzGetTriggerFrame(), false)
            BlzFrameSetEnable(BlzGetTriggerFrame(), true)
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (this._isUnitsShow[index]) {
                    this._isUnitsShow[index] = false
                    this._isItemsShow[index] = true
                    UpdateTasButtonList(this._itemList)
                    BlzFrameSetText(this._button[index], "To units")
                } else if (this._isItemsShow[index]) {
                    this._isUnitsShow[index] = true
                    this._isItemsShow[index] = false
                    UpdateTasButtonList(this._unitList[index])
                    BlzFrameSetText(this._button[index], "To items")
                }

                BlzFrameSetVisible(this._frameA[index], this._isUnitsShow[index])
                BlzFrameSetVisible(this._frameB[index], this._isItemsShow[index])
                
            }
        })
        BlzTriggerRegisterFrameEvent(trigger, this._button[index], FRAMEEVENT_CONTROL_CLICK)
    }

    private hideTrigger(index: number) {
        let trigger = CreateTrigger()
        TriggerAddAction(trigger, function() {
            print('ok')
            let playerId = GetPlayerId(GetLocalPlayer())
            xpcall(() => {
                BlzFrameSetEnable(BlzGetTriggerFrame(), false)
                BlzFrameSetEnable(BlzGetTriggerFrame(), true)
                if (GetLocalPlayer() == GetTriggerPlayer()) {
                    if (this._isHided[playerId]) {
                        this._isHided[playerId] = false
                        //BlzFrameSetVisible(this._frameA, this._isUnitsShow)
                        //BlzFrameSetVisible(this._frameB, this._isItemsShow)
                        //BlzFrameSetEnable(this._button, true)

                        BlzFrameSetText(this._hideButton[playerId], "Show store")
                    } else {
                        this._isHided[playerId] = true
                        //BlzFrameSetVisible(this._frameA, false)
                        //BlzFrameSetEnable(this._button, false)
                        
                        UpdateTasButtonList(this._unitList[playerId])
                        UpdateTasButtonList(this._itemList[playerId])
                        BlzFrameSetText(this._hideButton[playerId], "Hide")
                    }
                    BlzFrameSetVisible(this._boxes[playerId], this._isHided[playerId])
                }
            }, print)
        })
        BlzTriggerRegisterFrameEvent(trigger, this._hideButton[index], FRAMEEVENT_CONTROL_CLICK)
    }

    private createUnitList(index: number) {
        this._unitList[index] = CreateTasButtonListV2(6, this._frameA[index], function(data, buttonListObject, dataIndex) {
            let gold = 0
            let lumber = 0
            if (!IsUnitIdType(data, UNIT_TYPE_HERO)) {
                gold = GetUnitGoldCost(data)
                lumber = GetUnitWoodCost(data)
            } else {
                gold = 0
                lumber = 0
            }
            let player = GetTriggerPlayer()
            let state;
            if (Force.fromHandle(GetForceOfPlayer(player)).hasPlayer(MapPlayer.fromHandle(Player(0)))) {
                state = Coords.FTeamCreate
            } else {
                state = Coords.STeamCreate
            }
            
            if (GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD) >= gold) {
                if (GetPlayerState(player, PLAYER_STATE_RESOURCE_LUMBER) >= lumber) {
                    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, -gold)
                    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, -lumber)
                    CreateUnit(player, data, state.x, state.y, 0)
                } /*else if (!GetSoundIsPlaying(SoundNoLumber[GetPlayerRace(player)])) {
                    StartSoundForPlayerBJ(player, SoundNoLumber[GetPlayerRace(player)])
                }*/
            } /*else if (!GetSoundIsPlaying(SoundNoGold[GetPlayerRace(player)])) {
                //StartSoundForPlayerBJ(player, SoundNoGold[GetPlayerRace(player)])
            }*/
            
        }, null, null, null)
    }

    private createItemList(index: number) {
        this._itemList[index] = CreateTasButtonList(7, this._frameB[index], function(data, buttonListObject, dataIndex) {
            let player = GetTriggerPlayer()
            let lumber = ItemData[data].Lumber
            let gold = ItemData[data].Gold
            if (GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD) >= gold) {
                if (GetPlayerState(player, PLAYER_STATE_RESOURCE_LUMBER) >= lumber) {
                    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, -gold)
                    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, -lumber)
                    CreateItem(data, GetPlayerStartLocationX(player), GetPlayerStartLocationY(player))
                } /*else if (!GetSoundIsPlaying(SoundNoLumber[GetPlayerRace(player)])) {
                    StartSoundForPlayerBJ(player, SoundNoLumber[GetPlayerRace(player)])
                }*/
            } /*else if (!GetSoundIsPlaying(SoundNoGold[GetPlayerRace(player)]) {
                StartSoundForPlayerBJ(player, SoundNoGold[GetPlayerRace(player)])
            }*/
        }, 
        // runs once for each button shown
        function (frameObject, data) {
            BlzFrameSetTexture(frameObject.Icon, BlzGetAbilityIcon(data), 0, false)
            BlzFrameSetText(frameObject.Text, GetObjectName(data))
        
            BlzFrameSetTexture(frameObject.ToolTipFrameIcon, BlzGetAbilityIcon(data), 0, false)
            BlzFrameSetText(frameObject.ToolTipFrameName, GetObjectName(data))      
        
            BlzFrameSetText(frameObject.ToolTipFrameText, BlzGetAbilityExtendedTooltip(data, 0))
            if (ItemData[data]) {
                let lumber = ItemData[data].Lumber
                let gold = ItemData[data].Gold
                if (GetPlayerState(GetLocalPlayer(), PLAYER_STATE_RESOURCE_GOLD) >= gold) {
                    BlzFrameSetText(frameObject.TextGold, gold)
                } else {
                    BlzFrameSetText(frameObject.TextGold, `|cffff2010${gold}`)
                }
                
                if (GetPlayerState(GetLocalPlayer(), PLAYER_STATE_RESOURCE_LUMBER) >= lumber) {
                    BlzFrameSetText(frameObject.TextLumber, lumber)
                } else {
                    BlzFrameSetText(frameObject.TextLumber, `|cffff2010${lumber}`)
                }
            } else {
                BlzFrameSetText(frameObject.TextLumber, "xxx")
                BlzFrameSetText(frameObject.TextGold, "xxx")
            }
        }, null, null)
    }

    private static AddItemAndGetCost(buttonListObject: tasobject, itemCode) {
	    if (GetObjectName(itemCode) != "") {
            TasButtonListAddData(buttonListObject, itemCode)
            ItemGetCost(itemCode)
        }
    }
}
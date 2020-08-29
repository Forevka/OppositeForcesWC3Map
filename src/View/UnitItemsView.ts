import { Coords } from "Config";
import { Force, MapPlayer } from "w3ts/index";

export class UnitItemsView {
    private _box: framehandle;
    private _button: framehandle;
    private _hideButton: framehandle;

    private _buttonBox: framehandle;

    private _frameA: framehandle;
    private _frameB: framehandle;

    private _unitList: tasobject;
    private _itemList: tasobject;
    
    private _isUnitsShow: boolean;
    private _isItemsShow: boolean;
    private _isHided: boolean;

    public static _instance: UnitItemsView;

    public constructor() {
        this._isUnitsShow = true
        this._isItemsShow = false
        
        this._isHided = true

        this._box = BlzCreateFrame("EscMenuBackdrop", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
        BlzFrameSetSize(this._box, 0.255, 0.26)
        BlzFrameSetAbsPoint(this._box, FRAMEPOINT_TOPRIGHT, 0.80, 0.46)

        this._button = BlzCreateFrameByType("GLUETEXTBUTTON", "", this._box, "ScriptDialogButton",0)
        BlzFrameSetAbsPoint(this._button, FRAMEPOINT_TOPRIGHT, 0.78, 0.48)
        BlzFrameSetSize(this._button, 0.1, 0.03)
        BlzFrameSetText(this._button, "To items")

        this._hideButton = BlzCreateFrameByType("GLUETEXTBUTTON", "", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), "ScriptDialogButton",0)
        BlzFrameSetAbsPoint(this._hideButton, FRAMEPOINT_TOPRIGHT, 0.67, 0.48)
        BlzFrameSetSize(this._hideButton, 0.1, 0.03)
        BlzFrameSetText(this._hideButton, "Hide")

        this._frameA = BlzCreateFrameByType("FRAME", "", this._box, "",0)
        BlzFrameSetSize(this._frameA, 0.23, 0.001)
        //BlzFrameSetAbsPoint(frameA, FRAMEPOINT_TOPRIGHT, 0.78, 0.54)
        BlzFrameSetPoint(this._frameA, FRAMEPOINT_TOPLEFT, this._box, FRAMEPOINT_TOPLEFT, 0, -0.02)
        BlzFrameSetVisible(this._frameB, this._isUnitsShow)

        this._frameB = BlzCreateFrameByType("FRAME", "", this._box, "",0)
        BlzFrameSetSize(this._frameB, 0.23, 0.001)
        // BlzFrameSetAbsPoint(frameB, FRAMEPOINT_TOPRIGHT, 0.78, 0.54)
        BlzFrameSetPoint(this._frameB, FRAMEPOINT_TOPLEFT, this._box, FRAMEPOINT_TOPLEFT, 0, -0.02)
        BlzFrameSetVisible(this._frameB, this._isItemsShow)

        this.changeFrameTrigger()
        this.hideTrigger()

        this.createUnitList()
        this.createItemList()
    }

    public static get Instance() {
        let ins = UnitItemsView._instance

        if (ins == null) {
            ins = new UnitItemsView()
        }

        return ins
    }

    public addUnit(id: number) {
        TasButtonListAddData(this._unitList, id)
    }

    public addItem(id: number) {
        UnitItemsView.AddItemAndGetCost(this._itemList, id)
    }

    public refresh() {
        BlzFrameSetValue(this._unitList.Slider, 999999)
        BlzFrameSetValue(this._itemList.Slider, 999999)
    }

    private changeFrameTrigger() {
        let trigger = CreateTrigger()
        TriggerAddAction(trigger, function() {
            BlzFrameSetEnable(BlzGetTriggerFrame(), false)
            BlzFrameSetEnable(BlzGetTriggerFrame(), true)
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (this._isUnitsShow) {
                    this._isUnitsShow = false
                    this._isItemsShow = true
                    UpdateTasButtonList(this._itemList)
                    BlzFrameSetText(this._button, "To units")
                } else if (this._isItemsShow) {
                    this._isUnitsShow = true
                    this._isItemsShow = false
                    UpdateTasButtonList(this._unitList)
                    BlzFrameSetText(this._button, "To items")
                }

                BlzFrameSetVisible(this._frameA, this._isUnitsShow)
                BlzFrameSetVisible(this._frameB, this._isItemsShow)
                
            }
        })
        BlzTriggerRegisterFrameEvent(trigger, this._button, FRAMEEVENT_CONTROL_CLICK)
    }

    private hideTrigger() {
        let trigger = CreateTrigger()
        TriggerAddAction(trigger, function() {
            print('ok')
            xpcall(() => {
                print('ok 2')
                BlzFrameSetEnable(BlzGetTriggerFrame(), false)
                BlzFrameSetEnable(BlzGetTriggerFrame(), true)
                if (GetLocalPlayer() == GetTriggerPlayer()) {
                    if (this._isHided) {
                        this._isHided = false
                        //BlzFrameSetVisible(this._frameA, this._isUnitsShow)
                        //BlzFrameSetVisible(this._frameB, this._isItemsShow)
                        //BlzFrameSetEnable(this._button, true)

                        BlzFrameSetText(this._hideButton, "Show store")
                    } else {
                        this._isHided = true
                        //BlzFrameSetVisible(this._frameA, false)
                        //BlzFrameSetEnable(this._button, false)
                        
                        UpdateTasButtonList(this._unitList)
                        UpdateTasButtonList(this._itemList)
                        BlzFrameSetText(this._hideButton, "Hide")
                    }
                    BlzFrameSetVisible(this._box, this._isHided)
                }
            }, print)
        })
        BlzTriggerRegisterFrameEvent(trigger, this._hideButton, FRAMEEVENT_CONTROL_CLICK)
    }

    private createUnitList() {
        this._unitList = CreateTasButtonListV2(6, this._frameA, function(data, buttonListObject, dataIndex) {
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

    private createItemList() {
        this._itemList = CreateTasButtonList(8, this._frameB, function(data, buttonListObject, dataIndex) {
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
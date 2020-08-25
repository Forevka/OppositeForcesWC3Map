export class UnitItemsView {
    private _box: framehandle;
    private _button: framehandle;
    private _frameA: framehandle;
    private _frameB: framehandle;

    private _unitList: tasobject;
    private _itemList: tasobject;
    
    public static _instance: UnitItemsView;

    public constructor() {
        this._box = BlzCreateFrame("EscMenuBackdrop", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
        BlzFrameSetSize(this._box, 0.255, 0.29)
        BlzFrameSetAbsPoint(this._box, FRAMEPOINT_TOPRIGHT, 0.80, 0.46)

        this._button = BlzCreateFrameByType("GLUETEXTBUTTON", "", this._box, "ScriptDialogButton",0)
        BlzFrameSetAbsPoint(this._button, FRAMEPOINT_TOPRIGHT, 0.78, 0.48)
        BlzFrameSetSize(this._button, 0.1, 0.03)
        BlzFrameSetText(this._button, "To items")

        this._frameA = BlzCreateFrameByType("FRAME", "", this._box, "",0)
        BlzFrameSetSize(this._frameA, 0.23, 0.001)
        //BlzFrameSetAbsPoint(frameA, FRAMEPOINT_TOPRIGHT, 0.78, 0.54)
        BlzFrameSetPoint(this._frameA, FRAMEPOINT_TOPLEFT, this._box, FRAMEPOINT_TOPLEFT, 0, -0.02)

        this._frameB = BlzCreateFrameByType("FRAME", "", this._box, "",0)
        BlzFrameSetSize(this._frameB, 0.23, 0.001)
        // BlzFrameSetAbsPoint(frameB, FRAMEPOINT_TOPRIGHT, 0.78, 0.54)
        BlzFrameSetPoint(this._frameB, FRAMEPOINT_TOPLEFT, this._box, FRAMEPOINT_TOPLEFT, 0, -0.02)
        BlzFrameSetVisible(this._frameB, false)

        this.changeFrameTrigger()
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
                if (BlzFrameIsVisible(this._frameA)) {
                    BlzFrameSetVisible(this._frameA, false)
                    BlzFrameSetVisible(this._frameB, true)
                    UpdateTasButtonList(this._itemList)
                    BlzFrameSetText(this._button, "To items")
                } else if (BlzFrameIsVisible(this._frameB)) {
                    BlzFrameSetVisible(this._frameA, true)
                    BlzFrameSetVisible(this._frameB, false)
                    UpdateTasButtonList(this._itemList)
                    BlzFrameSetText(this._button, "To units")
                }
            }
        })
        BlzTriggerRegisterFrameEvent(trigger, this._button, FRAMEEVENT_CONTROL_CLICK)
    }

    private createUnitList() {
        this._unitList = CreateTasButtonListV2(8, this._frameA, function(data, buttonListObject, dataIndex) {
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
            
            if (GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD) >= gold) {
                if (GetPlayerState(player, PLAYER_STATE_RESOURCE_LUMBER) >= lumber) {
                    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, -gold)
                    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, -lumber)
                    CreateUnit(player, data, GetPlayerStartLocationX(player), GetPlayerStartLocationY(player), 0)
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
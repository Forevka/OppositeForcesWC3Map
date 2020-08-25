/*export class ButtonList {
    private _syncTrigger: trigger;
    private _buttonTrigger: trigger;
    private _searchTrigger: trigger;
    private _buttonScrollTrigger: trigger;
    private _sliderTrigger: trigger;
    private _buttonList: Map<framehandle, any>;

    public static Instances: Map<string, ButtonList>;

    public constructor() {
        BlzLoadTOCFile("war3mapimported\\TasButtonList.toc")

        this._syncTrigger = CreateTrigger()
        TriggerAddAction(this._syncTrigger, () => {
            print('sync trigger')
            let buttonListObject = this._buttonList.get(BlzGetTriggerFrame())
            let dataIndex = math.tointeger(BlzGetTriggerFrameValue())

            if (buttonListObject.ButtonAction)
            {
                buttonListObject.ButtonAction(buttonListObject.Data[dataIndex], buttonListObject, dataIndex)
            }

            this.UpdateTasButtonList(buttonListObject)
        })

        this._buttonTrigger = CreateTrigger()
        TriggerAddAction(this._buttonTrigger, () => {
            let buttonIndex = this._buttonList.get(BlzGetTriggerFrame()).Index
            let buttonListObject = this._buttonList.get(this._buttonList.get(BlzGetTriggerFrame()))
            let dataIndex = buttonListObject.DataFiltered[buttonListObject.ViewPoint + buttonIndex]
            BlzFrameSetEnable(BlzGetTriggerFrame(), false)
            BlzFrameSetEnable(BlzGetTriggerFrame(), true)
            if (GetLocalPlayer() == GetTriggerPlayer())
                BlzFrameSetValue(buttonListObject.SyncFrame, dataIndex)

        })

        this._searchTrigger = CreateTrigger()
        TriggerAddAction(this._searchTrigger, () => {
            this.TasButtonListSearch(this._buttonList.get(BlzGetTriggerFrame()), BlzFrameGetText(BlzGetTriggerFrame()))
        })

        this._buttonScrollTrigger = CreateTrigger()
        TriggerAddAction(this._buttonScrollTrigger, () => {
            let buttonListObject = this._buttonList.get(this._buttonList.get(BlzGetTriggerFrame()))
            let frame = buttonListObject.Slider
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (BlzGetTriggerFrameValue() > 0) {
                    BlzFrameSetValue(frame, BlzFrameGetValue(frame) + buttonListObject.SliderStep)
                } else {
                    BlzFrameSetValue(frame, BlzFrameGetValue(frame) - buttonListObject.SliderStep)
                }
            }
        })

        this._sliderTrigger = CreateTrigger()
        TriggerAddAction(this._sliderTrigger, () => {
            let buttonListObject = this._buttonList.get(BlzGetTriggerFrame())
            let frame = BlzGetTriggerFrame()
            if (GetLocalPlayer() == GetTriggerPlayer()) {
                if (BlzGetTriggerFrameEvent() == FRAMEEVENT_MOUSE_WHEEL) {
                    if (BlzGetTriggerFrameValue() > 0) {
                        BlzFrameSetValue(frame, BlzFrameGetValue(frame) + buttonListObject.SliderStep)
                    } else {
                        BlzFrameSetValue(frame, BlzFrameGetValue(frame) - buttonListObject.SliderStep)
                    }
                } else {
                    if (buttonListObject.DataFiltered.length > buttonListObject.Frames.length) {
                        buttonListObject.ViewPoint = buttonListObject.DataFiltered.length - math.tointeger(BlzGetTriggerFrameValue())
                    } else {
                        buttonListObject.ViewPoint = 0
                    }

                    this.UpdateTasButtonList(buttonListObject)
                }
            }
        })

        this._buttonList = new Map<framehandle, any>()
    }

    public Instance(name: string) {
        let ins = ButtonList.Instances.get(name)
        if (ins == null) {
            print(`Creating new ButtonList ${name}`)
            ins = new ButtonList()
            ButtonList.Instances.set(name, ins)
        }

        return ins
    }

    private SearchTasButtonListDefaultObject(data, searchedText, buttonListObject) {
        return string.find(GetObjectName(data), searchedText)
    }

    private UpdateTasButtonList(buttonListObject) {
        xpcall(() => {
            let data = buttonListObject.Data
            BlzFrameSetVisible(buttonListObject.Slider, buttonListObject.DataFiltered.length > buttonListObject.Frames.length)
            //for int = 1, #buttonListObject.Frames do
            for (let i = 0; i < buttonListObject.Frames.length; i++) {
                let frameObject = buttonListObject.Frames[i]
                if (buttonListObject.DataFiltered.length >= i) {
                    buttonListObject.UpdateAction(frameObject, data[buttonListObject.DataFiltered[i + buttonListObject.ViewPoint]])
                    BlzFrameSetVisible(frameObject.Button, true)
                } else {
                    BlzFrameSetVisible(frameObject.Button, false)
                }
            }
        }, print)
    }

    public CreateTasButtonListV2(rowCount, parent, buttonAction, updateAction, searchAction, filterAction) {
        let buttonCount = rowCount*2
        let object = InitTasButtonListObject(parent, buttonAction, updateAction, searchAction, filterAction)

        let rowEnd = false
        for (let i = 0; i < buttonCount; i++) {
            let frameObject: any = {}
            frameObject.Index = i
            frameObject.Button = BlzCreateFrame("TasButtonSmall", parent, 0, 0)
            frameObject.ToolTipFrame = BlzCreateFrame("TasButtonListTooltipBox", frameObject.Button, 0, 0)
            frameObject.ToolTipFrameIcon = BlzGetFrameByName("TasButtonListTooltipIcon", 0)
            frameObject.ToolTipFrameName = BlzGetFrameByName("TasButtonListTooltipName", 0)
            frameObject.ToolTipFrameSeperator = BlzGetFrameByName("TasButtonListTooltipSeperator", 0)
            frameObject.ToolTipFrameText = BlzGetFrameByName("TasButtonListTooltipText", 0)    
            BlzFrameSetPoint(frameObject.ToolTipFrame, FRAMEPOINT_TOPRIGHT, parent, FRAMEPOINT_TOPLEFT, -0.001, 0)
            BlzFrameSetTooltip(frameObject.Button, frameObject.ToolTipFrame)

            frameObject.Icon = BlzGetFrameByName("TasButtonSmallIcon", 0)
            frameObject.Text = BlzGetFrameByName("TasButtonSmallText", 0)
            frameObject.IconGold = BlzGetFrameByName("TasButtonSmallIconGold", 0)
            frameObject.TextGold = BlzGetFrameByName("TasButtonSmallTextGold", 0)
            frameObject.IconLumber = BlzGetFrameByName("TasButtonSmallIconLumber", 0)
            frameObject.TextLumber = BlzGetFrameByName("TasButtonSmallTextLumber", 0)
            TasButtonList[frameObject.Button] = frameObject
            TasButtonList[frameObject] = object
            table.insert(object.Frames, frameObject)
            BlzTriggerRegisterFrameEvent(TasButtonList.ButtonTrigger, frameObject.Button, FRAMEEVENT_CONTROL_CLICK)
            BlzTriggerRegisterFrameEvent(TasButtonList.ButtonScrollTrigger, frameObject.Button, FRAMEEVENT_MOUSE_WHEEL)
            rowEnd = not rowEnd
            if int > 1 then 
                if rowEnd then
                    BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_TOP, object.Frames[int - 2].Button, FRAMEPOINT_BOTTOM, 0, -0)
                else
                    BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_RIGHT, object.Frames[int - 1].Button, FRAMEPOINT_LEFT, 0, -0)
                end
            else
                BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_TOPRIGHT, object.InputFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)            
            end
            
        }

        InitTasButtonListSlider(object, 2, rowCount)

        return object
    }

    /*public static InitTasButtonListObject(parent, buttonAction, updateAction, searchAction, filterAction) {
        let object: any = {
            Data: {}, 
            DataFiltered: {}, 
            ViewPoint: 0,
            Frames: {},
            Parent: parent
        }
        object.ButtonAction = buttonAction //--call this inside the SyncAction after a button is clicked
        object.UpdateAction = updateAction //--function defining how to display stuff (async)
        object.SearchAction = searchAction //--function to return the searched Text (async)
        object.FilterAction = filterAction //--
        if not updateAction then object.UpdateAction = UpdateTasButtonListDefaultObject end
        if not searchAction then object.SearchAction = SearchTasButtonListDefaultObject end
        table.insert(TasButtonList, object) --index to TasButtonList
        TasButtonList[object] = #TasButtonList -- TasButtonList to Index

        object.SyncFrame = BlzCreateFrameByType("SLIDER", "", parent, "", 0)
        BlzFrameSetMinMaxValue(object.SyncFrame, 0, 9999999)
        BlzFrameSetStepSize(object.SyncFrame, 1.0)
        BlzTriggerRegisterFrameEvent(TasButtonList.SyncTrigger, object.SyncFrame, FRAMEEVENT_SLIDER_VALUE_CHANGED)
        BlzFrameSetVisible(object.SyncFrame, false)
        TasButtonList[object.SyncFrame] = object

        object.InputFrame = BlzCreateFrame("TasEditBox", parent, 0, 0)
        BlzTriggerRegisterFrameEvent(TasButtonList.SearchTrigger, object.InputFrame, FRAMEEVENT_EDITBOX_TEXT_CHANGED)
        BlzFrameSetPoint(object.InputFrame, FRAMEPOINT_TOPRIGHT, parent, FRAMEPOINT_TOPRIGHT, 0, 0)
        TasButtonList[object.InputFrame] = object

        return object
    }*/
//}
/*
function GenerateItemList() {
    let box = BlzCreateFrame("EscMenuBackdrop", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
    BlzFrameSetSize(box, 0.255, 0.29)
    BlzFrameSetAbsPoint(box, FRAMEPOINT_TOPRIGHT, 0.80, 0.56)

    let button = BlzCreateFrameByType("GLUETEXTBUTTON", "", box, "ScriptDialogButton",0)
    BlzFrameSetAbsPoint(button, FRAMEPOINT_TOPRIGHT, 0.78, 0.58)
    BlzFrameSetSize(button, 0.1, 0.03)
    BlzFrameSetText(button, "Units")

    let frameA = BlzCreateFrameByType("FRAME", "", box, "",0)
    BlzFrameSetSize(frameA, 0.23, 0.001)
    
    BlzFrameSetPoint(frameA, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, 0, -0.02)
    let object = CreateTasButtonListV2(8, frameA, function(data, buttonListObject, dataIndex)
        local gold, lumber
        if not IsUnitIdType(data, UNIT_TYPE_HERO) then
            gold = GetUnitGoldCost(data)
            lumber = GetUnitWoodCost(data)
        else
            gold = 0
            lumber = 0
        end
        local player = GetTriggerPlayer()
        if GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD) >= gold then
            if GetPlayerState(player, PLAYER_STATE_RESOURCE_LUMBER) >= lumber then
                AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, -gold)
                AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, -lumber)
                CreateUnit(player, data, GetPlayerStartLocationX(player), GetPlayerStartLocationY(player), 0)
            elseif not GetSoundIsPlaying(SoundNoLumber[GetPlayerRace(player)]) then
                StartSoundForPlayerBJ(player, SoundNoLumber[GetPlayerRace(player)])
            end
        elseif not GetSoundIsPlaying(SoundNoGold[GetPlayerRace(player)]) then
            StartSoundForPlayerBJ(player, SoundNoGold[GetPlayerRace(player)])
        end
        
    end)
}*/
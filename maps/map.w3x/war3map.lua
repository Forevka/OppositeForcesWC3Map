gg_trg_StartResources = nil
gg_trg_Melee_Initialization = nil
function InitGlobals()
end


--[[
TasButtonList7a by Tasyen

function CreateTasButtonList(buttonCount, parent, buttonAction, updateAction, searchAction, filterAction)
 create a new List
 parent is the container of this Frame it will attach itself to its TOP.
 buttonAction is the function that executes when an option is clicked. args: (clickedData, buttonListObject, dataIndex)
 when your data are unit-RawCodes then you can skip updateAction & searchAction.
 updateAction runs for each Button and is used to set the diplayed content. args:(frameObject, data)
    frameObject.Button
    frameObject.ToolTipFrame
    frameObject.ToolTipFrameIcon
    frameObject.ToolTipFrameName
    frameObject.ToolTipFrameSeperator
    frameObject.ToolTipFrameText

    frameObject.Icon
    frameObject.Text
    frameObject.IconGold
    frameObject.TextGold
    frameObject.IconLumber
    frameObject.TextLumber
    TasButtonList[frameObject] => buttonListObject

    data is one entry of the TasButtonLists Data-Array.

 searchAction is a function that returns true if the current data matches the searchText. Args: (data, searchedText, buttonListObject)
 filterAction is meant to be used when one wants an addtional non text based filtering, with returning true allowing data or false rejecting it. Args: (data, buttonListObject, isTextSearching)
 searchAction , udateAction & filterAction are async this functions should not do anything that alters the game state/flow.

function CreateTasButtonListV2(rowCount, parent, buttonAction, updateAction, searchAction, filterAction)
    2 Buttons each Row, takes more Height then the other Versions
function CreateTasButtonListV3(rowCount, parent, buttonAction, updateAction, searchAction, filterAction)
    3 Buttons each Row, only Icon, and Costs

function TasButtonListClearData(buttonListObject)
    remove all data
function TasButtonListRemoveData(buttonListObject, data)
    search for data and remove it
function TasButtonListAddData(buttonListObject, data)
    add data for one Button
function TasButtonListCopyData(writeObject, readObject)
    writeObject uses the same data as readObject and calls UpdateButtonList.
function UpdateTasButtonList(buttonListObject)
    update the displayed Content should be done after Data was added or removed was used.
TasButtonListSearch(buttonListObject[, text])
    The buttonList will search it's data for the given text, if nil is given as text it will search for what the user currently has in its box.
    This will also update the buttonList
--]]

BlzLoadTOCFile("war3mapimported\\TasButtonList.toc")
TasButtonList = {}

TasButtonList.SyncTrigger = CreateTrigger()
TasButtonList.SyncTriggerAction = TriggerAddAction(TasButtonList.SyncTrigger, function()
    xpcall(function()
    local buttonListObject = TasButtonList[BlzGetTriggerFrame()]
    local dataIndex = math.tointeger(BlzGetTriggerFrameValue())

    if buttonListObject.ButtonAction then
        -- call the wanted action, 1 the current Data
        buttonListObject.ButtonAction(buttonListObject.Data[dataIndex], buttonListObject, dataIndex)
    end
    UpdateTasButtonList(buttonListObject)
    end,print)
end)

-- handles the clicking
TasButtonList.ButtonTrigger = CreateTrigger()
TasButtonList.ButtonTriggerAction = TriggerAddAction(TasButtonList.ButtonTrigger, function()
    local buttonIndex = TasButtonList[BlzGetTriggerFrame()].Index
    local buttonListObject = TasButtonList[TasButtonList[BlzGetTriggerFrame()]]
    local dataIndex = buttonListObject.DataFiltered[buttonListObject.ViewPoint + buttonIndex]
    BlzFrameSetEnable(BlzGetTriggerFrame(), false)
    BlzFrameSetEnable(BlzGetTriggerFrame(), true)
    if GetLocalPlayer() == GetTriggerPlayer() then
        BlzFrameSetValue(buttonListObject.SyncFrame, dataIndex)
    end
end)

TasButtonList.SearchTrigger = CreateTrigger()
TasButtonList.SearchTriggerAction = TriggerAddAction(TasButtonList.SearchTrigger, function()
    TasButtonListSearch(TasButtonList[BlzGetTriggerFrame()], BlzFrameGetText(BlzGetTriggerFrame()))
end)

-- scrolling while pointing on Buttons
TasButtonList.ButtonScrollTrigger = CreateTrigger()
TasButtonList.ButtonScrollTriggerAction = TriggerAddAction(TasButtonList.ButtonScrollTrigger, function()
    local buttonListObject = TasButtonList[TasButtonList[BlzGetTriggerFrame()]]
    local frame = buttonListObject.Slider
    if GetLocalPlayer() == GetTriggerPlayer() then
        if BlzGetTriggerFrameValue() > 0 then
            BlzFrameSetValue(frame, BlzFrameGetValue(frame) + buttonListObject.SliderStep)
        else
            BlzFrameSetValue(frame, BlzFrameGetValue(frame) - buttonListObject.SliderStep)
        end
    end
end)

-- scrolling while pointing on slider aswell as calling
TasButtonList.SliderTrigger = CreateTrigger()
TasButtonList.SliderTriggerAction = TriggerAddAction(TasButtonList.SliderTrigger, function()
    local buttonListObject = TasButtonList[BlzGetTriggerFrame()]
    local frame = BlzGetTriggerFrame()
    if GetLocalPlayer() == GetTriggerPlayer() then
        if BlzGetTriggerFrameEvent() == FRAMEEVENT_MOUSE_WHEEL then
            if BlzGetTriggerFrameValue() > 0 then
                BlzFrameSetValue(frame, BlzFrameGetValue(frame) + buttonListObject.SliderStep)
            else
                BlzFrameSetValue(frame, BlzFrameGetValue(frame) - buttonListObject.SliderStep)
            end
        else
            -- when there is enough data use viewPoint. the Viewpoint is reduced from the data to make top being top.
            if #buttonListObject.DataFiltered > #buttonListObject.Frames then
                buttonListObject.ViewPoint = #buttonListObject.DataFiltered - math.tointeger(BlzGetTriggerFrameValue())
            else
                buttonListObject.ViewPoint = 0
            end
            UpdateTasButtonList(buttonListObject)
        end
    end
end)

--runs once for each button shown
function UpdateTasButtonListDefaultObject(frameObject, data)
    BlzFrameSetTexture(frameObject.Icon, BlzGetAbilityIcon(data), 0, false)
    BlzFrameSetText(frameObject.Text, GetObjectName(data))

    BlzFrameSetTexture(frameObject.ToolTipFrameIcon, BlzGetAbilityIcon(data), 0, false)
    BlzFrameSetText(frameObject.ToolTipFrameName, GetObjectName(data))      
--        frameObject.ToolTipFrameSeperator
    BlzFrameSetText(frameObject.ToolTipFrameText, BlzGetAbilityExtendedTooltip(data, 0))

    if not IsUnitIdType(data, UNIT_TYPE_HERO) then
        local lumber = GetUnitWoodCost(data)
        local gold = GetUnitGoldCost(data)
        if GetPlayerState(GetLocalPlayer(), PLAYER_STATE_RESOURCE_GOLD) >= gold then
            BlzFrameSetText(frameObject.TextGold, GetUnitGoldCost(data))
        else
            BlzFrameSetText(frameObject.TextGold, "|cffff2010"..GetUnitGoldCost(data))
        end    
        
        if GetPlayerState(GetLocalPlayer(), PLAYER_STATE_RESOURCE_LUMBER) >= lumber then
            BlzFrameSetText(frameObject.TextLumber, GetUnitWoodCost(data))
        else
            BlzFrameSetText(frameObject.TextLumber, "|cffff2010"..GetUnitWoodCost(data))
        end
    else
        BlzFrameSetText(frameObject.TextLumber, 0)
        BlzFrameSetText(frameObject.TextGold, 0)
    end
end

function SearchTasButtonListDefaultObject(data, searchedText, buttonListObject)
    --return BlzGetAbilityTooltip(data, 0)
    --return GetObjectName(data, 0)
    return string.find(GetObjectName(data), searchedText)
end

-- update the shown content
function UpdateTasButtonList(buttonListObject)
    xpcall(function()
    local data = buttonListObject.Data
    BlzFrameSetVisible(buttonListObject.Slider, #buttonListObject.DataFiltered > #buttonListObject.Frames)
    for int = 1, #buttonListObject.Frames do
        local frameObject = buttonListObject.Frames[int]
        if #buttonListObject.DataFiltered >= int  then
            buttonListObject.UpdateAction(frameObject, data[buttonListObject.DataFiltered[int + buttonListObject.ViewPoint]])
            BlzFrameSetVisible(frameObject.Button, true)
        else
            BlzFrameSetVisible(frameObject.Button, false)
        end
    end
end, print)
end

function InitTasButtonListObject(parent, buttonAction, updateAction, searchAction, filterAction)
    local object = {
        Data = {}, --an array each slot is the user data
        DataFiltered = {}, -- indexes of Data fitting the current search
        ViewPoint = 0,
        Frames = {},
        Parent = parent
    }
    object.ButtonAction = buttonAction --call this inside the SyncAction after a button is clicked
    object.UpdateAction = updateAction --function defining how to display stuff (async)
    object.SearchAction = searchAction --function to return the searched Text (async)
    object.FilterAction = filterAction --
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
end

function InitTasButtonListSlider(object, stepSize, rowCount)
    object.Slider = BlzCreateFrameByType("SLIDER", "FrameListSlider", object.Parent, "QuestMainListScrollBar", 0)
    TasButtonList[object.Slider] = object -- the slider nows the TasButtonListobject
    object.SliderStep = stepSize
    BlzFrameSetStepSize(object.Slider, stepSize)
    BlzFrameClearAllPoints(object.Slider)
    BlzFrameSetVisible(object.Slider, true)
    BlzFrameSetMinMaxValue(object.Slider, 0, 0)
    BlzFrameSetPoint(object.Slider, FRAMEPOINT_TOPLEFT, object.Frames[1].Button, FRAMEPOINT_TOPRIGHT, 0, 0)
    BlzFrameSetSize(object.Slider, 0.012, BlzFrameGetHeight(object.Frames[1].Button) * rowCount)
    BlzTriggerRegisterFrameEvent(TasButtonList.SliderTrigger, object.Slider , FRAMEEVENT_SLIDER_VALUE_CHANGED)
    BlzTriggerRegisterFrameEvent(TasButtonList.SliderTrigger, object.Slider , FRAMEEVENT_MOUSE_WHEEL)
end

function CreateTasButtonList(buttonCount, parent, buttonAction, updateAction, searchAction, filterAction)
    local object = InitTasButtonListObject(parent, buttonAction, updateAction, searchAction, filterAction)  

    for int = 1, buttonCount do
        local frameObject = {}
        frameObject.Index = int
        frameObject.Button = BlzCreateFrame("TasButton", parent, 0, 0)
        frameObject.ToolTipFrame = BlzCreateFrame("TasButtonListTooltipBox", frameObject.Button, 0, 0)
        frameObject.ToolTipFrameIcon = BlzGetFrameByName("TasButtonListTooltipIcon", 0)
        frameObject.ToolTipFrameName = BlzGetFrameByName("TasButtonListTooltipName", 0)
        frameObject.ToolTipFrameSeperator = BlzGetFrameByName("TasButtonListTooltipSeperator", 0)
        frameObject.ToolTipFrameText = BlzGetFrameByName("TasButtonListTooltipText", 0)    
        BlzFrameSetPoint(frameObject.ToolTipFrame, FRAMEPOINT_TOPRIGHT, parent, FRAMEPOINT_TOPLEFT, -0.001, 0)
        BlzFrameSetTooltip(frameObject.Button, frameObject.ToolTipFrame)

        frameObject.Icon = BlzGetFrameByName("TasButtonIcon", 0)
        frameObject.Text = BlzGetFrameByName("TasButtonText", 0)
        frameObject.IconGold = BlzGetFrameByName("TasButtonIconGold", 0)
        frameObject.TextGold = BlzGetFrameByName("TasButtonTextGold", 0)
        frameObject.IconLumber = BlzGetFrameByName("TasButtonIconLumber", 0)
        frameObject.TextLumber = BlzGetFrameByName("TasButtonTextLumber", 0)
        TasButtonList[frameObject.Button] = frameObject
        TasButtonList[frameObject] = object
        table.insert(object.Frames, frameObject)
        BlzTriggerRegisterFrameEvent(TasButtonList.ButtonTrigger, frameObject.Button, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasButtonList.ButtonScrollTrigger, frameObject.Button, FRAMEEVENT_MOUSE_WHEEL)
        if int > 1 then 
           BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_TOP, object.Frames[int - 1].Button, FRAMEPOINT_BOTTOM, 0, -0)
        else
            BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_TOPRIGHT, object.InputFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
        end
    end
    InitTasButtonListSlider(object, 1, buttonCount)

    return object
end

function CreateTasButtonListV2(rowCount, parent, buttonAction, updateAction, searchAction, filterAction)
    local buttonCount = rowCount*2
    local object = InitTasButtonListObject(parent, buttonAction, updateAction, searchAction, filterAction)

    local rowEnd = false
    for int = 1, buttonCount do
        local frameObject = {}
        frameObject.Index = int
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
        
    end
    InitTasButtonListSlider(object, 2, rowCount)

    return object
end

function CreateTasButtonListV3(rowCount, parent, buttonAction, updateAction, searchAction, filterAction)
    local buttonCount = rowCount*3
    local object = InitTasButtonListObject(parent, buttonAction, updateAction, searchAction, filterAction)

    local rowRemain = 3
    for int = 1, buttonCount do
        local frameObject = {}
        frameObject.Index = int
        frameObject.Button = BlzCreateFrame("TasButtonGrid", parent, 0, 0)
        frameObject.ToolTipFrame = BlzCreateFrame("TasButtonListTooltipBox", frameObject.Button, 0, 0)
        frameObject.ToolTipFrameIcon = BlzGetFrameByName("TasButtonListTooltipIcon", 0)
        frameObject.ToolTipFrameName = BlzGetFrameByName("TasButtonListTooltipName", 0)
        frameObject.ToolTipFrameSeperator = BlzGetFrameByName("TasButtonListTooltipSeperator", 0)
        frameObject.ToolTipFrameText = BlzGetFrameByName("TasButtonListTooltipText", 0)    
        BlzFrameSetPoint(frameObject.ToolTipFrame, FRAMEPOINT_TOPRIGHT, parent, FRAMEPOINT_TOPLEFT, -0.001, 0)
        BlzFrameSetTooltip(frameObject.Button, frameObject.ToolTipFrame)

        frameObject.Icon = BlzGetFrameByName("TasButtonGridIcon", 0)
        frameObject.Text = BlzGetFrameByName("TasButtonGridText", 0)
        frameObject.IconGold = BlzGetFrameByName("TasButtonGridIconGold", 0)
        frameObject.TextGold = BlzGetFrameByName("TasButtonGridTextGold", 0)
        frameObject.IconLumber = BlzGetFrameByName("TasButtonGridIconLumber", 0)
        frameObject.TextLumber = BlzGetFrameByName("TasButtonGridTextLumber", 0)
        TasButtonList[frameObject.Button] = frameObject
        TasButtonList[frameObject] = object
        table.insert(object.Frames, frameObject)
        BlzTriggerRegisterFrameEvent(TasButtonList.ButtonTrigger, frameObject.Button, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasButtonList.ButtonScrollTrigger, frameObject.Button, FRAMEEVENT_MOUSE_WHEEL)
        
        if int > 1 then 
            if rowRemain == 0 then
                BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_TOP, object.Frames[int - 3].Button, FRAMEPOINT_BOTTOM, 0, -0)
                rowRemain = 3
            else
                BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_RIGHT, object.Frames[int - 1].Button, FRAMEPOINT_LEFT, 0, -0)
            end
        else
            BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_TOPRIGHT, object.InputFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)            
        end
        rowRemain = rowRemain - 1
    end
    InitTasButtonListSlider(object, 3, rowCount)

    return object
end

function TasButtonListAddData(buttonListObject, data)
    table.insert( buttonListObject.Data, data)
    table.insert( buttonListObject.DataFiltered, #buttonListObject.Data)
    --BlzFrameSetMinMaxValue(buttonListObject.Slider, 0, #buttonListObject.Data - (#buttonListObject.Frames + 0))
    BlzFrameSetMinMaxValue(buttonListObject.Slider, #buttonListObject.Frames, #buttonListObject.Data)
end

function TasButtonListRemoveData(buttonListObject, data)
    local found = false
    for index, value in ipairs(buttonListObject.Data)
    do
        if value == data then
            table.remove(buttonListObject.Data, index)
            found = true
            break
        end
    end
    --BlzFrameSetMinMaxValue(buttonListObject.Slider, 0, #buttonListObject.Data - (#buttonListObject.Frames + 0))
    BlzFrameSetMinMaxValue(buttonListObject.Slider, #buttonListObject.Frames, #buttonListObject.Data)
end

function TasButtonListClearData(buttonListObject)
    repeat until not table.remove(buttonListObject.Data)
    repeat until not table.remove(buttonListObject.DataFiltered)
    BlzFrameSetMinMaxValue(buttonListObject.Slider, 0, 0)
end

function TasButtonListCopyData(writeObject, readObject)
    writeObject.Data = readObject.Data
    repeat until not table.remove(writeObject.DataFiltered)
    for index, value in ipairs(readObject.DataFiltered) do table.insert( writeObject.DataFiltered, value) end
    --BlzFrameSetMinMaxValue(writeObject.Slider, 0, #writeObject.Data - (#writeObject.Frames + 0))
    BlzFrameSetMinMaxValue(writeObject.Slider, #writeObject.Frames, #writeObject.Data)
    UpdateTasButtonList(writeObject)
end

function TasButtonListSearch(buttonListObject, text)
    if not text then text = BlzFrameGetText(buttonListObject.InputFrame) end
    local filteredData = buttonListObject.DataFiltered
    
    if GetLocalPlayer() == GetTriggerPlayer() then
        repeat do end until not table.remove(filteredData)
        if text ~= "" then
            for index, value in ipairs(buttonListObject.Data)
            do
                if buttonListObject.SearchAction(value, text, buttonListObject) and (not buttonListObject.FilterAction or buttonListObject.FilterAction(value, buttonListObject, true)) then
                    table.insert(filteredData, index)
                end
            end
            
        else
            for index, value in ipairs(buttonListObject.Data)
            do
                if not buttonListObject.FilterAction or buttonListObject.FilterAction(value, buttonListObject, false) then
                    table.insert(filteredData, index)
                end
            end
        end
        --table.sort(filteredData, function(a, b) return GetObjectName(buttonListObject.Data[a]) < GetObjectName(buttonListObject.Data[b]) end  )

        --update Slider, with that also update
        BlzFrameSetMinMaxValue(buttonListObject.Slider, #buttonListObject.Frames, math.max(#filteredData,0))
        BlzFrameSetValue(buttonListObject.Slider, 999999)
        
    end
end

TimerT = CreateTimer()
TimerStart(TimerT, 0.0, false, function()
    xpcall(function()
        local timer = GetExpiredTimer()
        local shopOwner = Player(bj_PLAYER_NEUTRAL_EXTRA)
        local shop = CreateUnit(shopOwner, FourCC('n003'), -3800, 6000, 0)
        local shopRect = Rect(0 , 0, 1000, 1000)
        MoveRectTo(shopRect, GetUnitX(shop), GetUnitY(shop))

        IssueNeutralTargetOrder(shopOwner, shop, "smart", shop)
        SetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD, 99999999)
        SetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER, 99999999)   
    local triggerOrder = CreateTrigger()
    ItemData = {}
    ItemData.Test = {}
    ItemData.Counter = 0
    TriggerAddAction(triggerOrder, function()
        xpcall(function()
        local itemCode = GetIssuedOrderId()
        --print("Order", GetObjectName(itemCode) )
        if not ItemData[itemCode] then 
            ItemData[itemCode] = {
                Gold = GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD),
                Lumber = GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER)
            }
            TimerStart(timer, 0, false, function()
                
                xpcall(function()
                    
                ItemData.Counter = ItemData.Counter + 1
                --print("After 0", GetObjectName(itemCode), ItemData.Counter)
                ItemData[itemCode].Gold = ItemData[itemCode].Gold - GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD)
                ItemData[itemCode].Lumber = ItemData[itemCode].Lumber - GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER)
                --print(GetObjectName(itemCode), ItemData[itemCode].Gold, ItemData[itemCode].Lumber)
                UnitRemoveAbility(shop, FourCC("Asid"))
                UnitAddAbility(shop, FourCC("Asid"))
                for index, value in ipairs(ItemData.Test)
                do
                    if value == itemCode then table.remove(ItemData.Test, index) break end
                end
                if #ItemData.Test > 0 then
                    AddItemToStock(shop, ItemData.Test[1], 1, 1)
                    SetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD, 99999999)
                    SetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER, 99999999)   
                    --print("Next", GetObjectName(ItemData.Test[1]), string.pack(">I4", ItemData.Test[1]))
                    IssueNeutralImmediateOrderById(shopOwner, shop, ItemData.Test[1])
                else
                    --print("out of data", ItemData.Counter)
                end
                EnumItemsInRect(shopRect, nil, function()
                    RemoveItem(GetEnumItem())
                end)
            end, print)
            end)
        end
    end, print)
    end)
    
    TriggerRegisterUnitEvent(triggerOrder, shop, EVENT_UNIT_ISSUED_ORDER)
    

    print("done")
    function ItemGetCost(itemCode)
        if not ItemData[itemCode] then
            table.insert( ItemData.Test, itemCode)
            if #ItemData.Test == 1 then
                print("start new")
                AddItemToStock(shop, itemCode, 1, 1)
                IssueNeutralTargetOrder(shopOwner, shop, "smart", shop2)
                IssueNeutralImmediateOrderById(shopOwner, shop, itemCode)
                --IssueNeutralTargetOrderById(shopOwner, shop, itemCode, shop)
            end
        else
        end
    end
end, print)
end)

function CreateBuildingsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 6272.0, 3200.0, 270.000, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), 4480.0, 3584.0, 270.000, FourCC("h001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 5696.0, 3840.0, 270.000, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3264.0, 3072.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1792.0, 3072.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3072.0, 3712.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2304.0, 3712.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1728.0, 2304.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3392.0, 2304.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1856.0, 1472.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3264.0, 1600.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1792.0, 1024.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2944.0, 640.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3520.0, 960.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1984.0, 512.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3008.0, 960.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1920.0, 768.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2688.0, 1472.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2624.0, 1984.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2752.0, 2496.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3456.0, 3072.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1984.0, 3008.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1792.0, 3648.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 896.0, 1152.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 320.0, 1984.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 384.0, 3136.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 1408.0, 3584.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 2624.0, 3456.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 1920.0, 2560.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3008.0, 1920.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 2176.0, 1344.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3584.0, 1152.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 4224.0, 1088.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5376.0, 1024.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5312.0, 1728.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 4864.0, 1792.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3584.0, 2048.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3008.0, 2816.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3520.0, 3520.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 4480.0, 3264.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5888.0, 2944.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5120.0, 2368.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3648.0, 2304.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 704.0, 3456.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 1024.0, 2624.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 7232.0, 3712.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 7168.0, 1152.0, 270.000, FourCC("n002"))
end

function CreateUnitsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("hfoo"), 1502.1, 2232.3, 330.281, FourCC("hfoo"))
end

function CreateBuildingsForPlayer1()
    local p = Player(1)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 5888.0, -2624.0, 270.000, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), 4288.0, -3712.0, 270.000, FourCC("h001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 5504.0, -3648.0, 270.000, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3456.0, -192.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3072.0, -256.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2176.0, -320.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1664.0, -320.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1728.0, -896.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2368.0, -960.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3136.0, -960.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3456.0, -896.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1728.0, -1472.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2688.0, -1536.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3008.0, -1472.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3584.0, -1472.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3520.0, -2240.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2816.0, -2176.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2176.0, -2240.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1472.0, -2240.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2304.0, -3072.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2880.0, -3072.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3264.0, -3072.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -3328.0, -3648.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -2624.0, -3712.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), -1856.0, -3776.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 384.0, -3584.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 192.0, -2688.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 320.0, -1792.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 768.0, -960.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 1856.0, -704.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3072.0, -1024.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 4096.0, -960.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5184.0, -1024.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5888.0, -704.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5376.0, -2112.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 4224.0, -2112.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 2944.0, -2048.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 2944.0, -3008.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 2880.0, -3584.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 3648.0, -3264.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 4672.0, -3264.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 1984.0, -1728.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 7168.0, -1088.0, 270.000, FourCC("n002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 7168.0, -2880.0, 270.000, FourCC("n002"))
end

function CreateUnitsForPlayer1()
    local p = Player(1)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("hfoo"), 1391.8, -2358.3, 330.281, FourCC("hfoo"))
end

function CreateBuildingsForPlayer2()
    local p = Player(2)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), 4352.0, 896.0, 270.000, FourCC("h001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 5888.0, 1536.0, 270.000, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 5376.0, 768.0, 270.000, FourCC("h002"))
end

function CreateBuildingsForPlayer3()
    local p = Player(3)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), 4352.0, -512.0, 270.000, FourCC("h001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 6272.0, -768.0, 270.000, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 5376.0, -768.0, 270.000, FourCC("h002"))
end

function CreateBuildingsForPlayer4()
    local p = Player(4)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n004"), -2624.0, 3456.0, 270.000, FourCC("n004"))
end

function CreateBuildingsForPlayer5()
    local p = Player(5)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n004"), -2560.0, -3520.0, 270.000, FourCC("n004"))
end

function CreateBuildingsForPlayer6()
    local p = Player(6)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 1504.0, 2720.0, 270.000, FourCC("n000"))
end

function CreateBuildingsForPlayer7()
    local p = Player(7)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 1376.0, -2784.0, 270.000, FourCC("n000"))
end

function CreateNeutralPassiveBuildings()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1536.0, 3584.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 640.0, 2688.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1536.0, 1792.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2432.0, 2688.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1152.0, 3456.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 768.0, 3072.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1920.0, 3456.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2304.0, 3072.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2304.0, 2304.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1920.0, 1920.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1152.0, 1920.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 768.0, 2304.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 960.0, 3264.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 960.0, 2112.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2112.0, 2112.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2112.0, 3264.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1408.0, -1920.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 512.0, -2816.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1408.0, -3712.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2304.0, -2816.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1792.0, -2048.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2176.0, -2432.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2176.0, -3200.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1792.0, -3584.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1024.0, -3584.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 640.0, -3200.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 640.0, -2432.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1024.0, -2048.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 832.0, -2240.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1984.0, -2240.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1984.0, -3392.0, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 832.0, -3392.0, 270.000, FourCC("n001"))
end

function CreatePlayerBuildings()
    CreateBuildingsForPlayer0()
    CreateBuildingsForPlayer1()
    CreateBuildingsForPlayer2()
    CreateBuildingsForPlayer3()
    CreateBuildingsForPlayer4()
    CreateBuildingsForPlayer5()
    CreateBuildingsForPlayer6()
    CreateBuildingsForPlayer7()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer0()
    CreateUnitsForPlayer1()
end

function CreateAllUnits()
    CreateNeutralPassiveBuildings()
    CreatePlayerBuildings()
    CreatePlayerUnits()
end

function Trig_StartResources_Func001A()
    SetPlayerStateBJ(GetEnumPlayer(), PLAYER_STATE_RESOURCE_LUMBER, 200)
    SetPlayerStateBJ(GetEnumPlayer(), PLAYER_STATE_RESOURCE_GOLD, 320)
end

function Trig_StartResources_Actions()
    ForForce(GetPlayersAll(), Trig_StartResources_Func001A)
end

function InitTrig_StartResources()
    gg_trg_StartResources = CreateTrigger()
    TriggerAddAction(gg_trg_StartResources, Trig_StartResources_Actions)
end

function Trig_Melee_Initialization_Actions()
    MeleeStartingVisibility()
    MeleeStartingHeroLimit()
end

function InitTrig_Melee_Initialization()
    gg_trg_Melee_Initialization = CreateTrigger()
    TriggerAddAction(gg_trg_Melee_Initialization, Trig_Melee_Initialization_Actions)
end

function InitCustomTriggers()
    InitTrig_StartResources()
    InitTrig_Melee_Initialization()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_StartResources)
    ConditionalTriggerExecute(gg_trg_Melee_Initialization)
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), false)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(1), false)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(2), 2)
    ForcePlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(2), false)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(3), 3)
    ForcePlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(3), false)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(4), 4)
    ForcePlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(4), false)
    SetPlayerController(Player(4), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(5), 5)
    ForcePlayerStartLocation(Player(5), 5)
    SetPlayerColor(Player(5), ConvertPlayerColor(5))
    SetPlayerRacePreference(Player(5), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(5), false)
    SetPlayerController(Player(5), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(6), 6)
    ForcePlayerStartLocation(Player(6), 6)
    SetPlayerColor(Player(6), ConvertPlayerColor(6))
    SetPlayerRacePreference(Player(6), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(6), false)
    SetPlayerController(Player(6), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(7), 7)
    ForcePlayerStartLocation(Player(7), 7)
    SetPlayerColor(Player(7), ConvertPlayerColor(7))
    SetPlayerRacePreference(Player(7), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(7), false)
    SetPlayerController(Player(7), MAP_CONTROL_COMPUTER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerState(Player(0), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(2), 0)
    SetPlayerState(Player(2), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(4), 0)
    SetPlayerState(Player(4), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(6), 0)
    SetPlayerState(Player(6), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(4), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(6), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(6), true)
    SetPlayerAllianceStateControlBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateControlBJ(Player(6), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(6), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(6), Player(4), true)
    SetPlayerTeam(Player(1), 1)
    SetPlayerState(Player(1), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(3), 1)
    SetPlayerState(Player(3), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(5), 1)
    SetPlayerState(Player(5), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(7), 1)
    SetPlayerState(Player(7), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(7), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(7), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(7), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(7), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(7), true)
    SetPlayerAllianceStateVisionBJ(Player(7), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(7), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(7), Player(5), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(5), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(7), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(7), true)
    SetPlayerAllianceStateControlBJ(Player(5), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(5), Player(7), true)
    SetPlayerAllianceStateControlBJ(Player(7), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(7), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(7), Player(5), true)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 1)
    SetStartLocPrio(0, 0, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 1)
    SetStartLocPrio(1, 0, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 1)
    SetStartLocPrio(2, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 1)
    SetStartLocPrio(3, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 4)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 2, 3, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(4, 3, 5, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrioCount(4, 1)
    SetEnemyStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(5, 4)
    SetStartLocPrio(5, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 1, 2, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(5, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 3, 4, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrioCount(5, 1)
    SetEnemyStartLocPrio(5, 0, 6, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrioCount(6, 3)
    SetEnemyStartLocPrio(6, 0, 4, MAP_LOC_PRIO_HIGH)
    SetEnemyStartLocPrio(6, 1, 5, MAP_LOC_PRIO_HIGH)
    SetEnemyStartLocPrio(6, 2, 7, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(7, 7)
    SetStartLocPrio(7, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(7, 4, 5, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(7, 5, 6, MAP_LOC_PRIO_LOW)
end

function main()
    SetCameraBounds(-4096.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -4096.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 8192.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 4096.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -4096.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 4096.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 8192.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -4096.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    NewSoundEnvironment("Default")
    SetAmbientDaySound("LordaeronSummerDay")
    SetAmbientNightSound("LordaeronSummerNight")
    SetMapMusic("Music", true, 0)
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
    RunInitializationTriggers()
end

function config()
    SetMapName("TRIGSTR_003")
    SetMapDescription("TRIGSTR_005")
    SetPlayers(8)
    SetTeams(8)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, 5248.0, 3072.0)
    DefineStartLocation(1, 4672.0, -3008.0)
    DefineStartLocation(2, 4992.0, 1600.0)
    DefineStartLocation(3, 4416.0, -1216.0)
    DefineStartLocation(4, 192.0, 2688.0)
    DefineStartLocation(5, 64.0, -2816.0)
    DefineStartLocation(6, 832.0, 3840.0)
    DefineStartLocation(7, 2496.0, -3584.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end


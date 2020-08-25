declare class tasobject{public Slider: any;}
declare var ItemData: any;

declare function CreateTasButtonListV2(rowCount: number, parent: framehandle, buttonAction: (data: any, buttonListObject: any, dataIndex: number) => void, updateAction: () => void | null, searchAction: () => void|null, filterAction: () => void|null): tasobject;
declare function CreateTasButtonList(rowCount: number, parent: framehandle, buttonAction: (data: any, buttonListObject: any, dataIndex: number) => void, updateAction: (frameObject: any, data: any) => void | null, searchAction: () => void|null, filterAction: () => void|null): tasobject;
declare function UpdateTasButtonList(object: tasobject): void;
declare function ItemGetCost(data: any): void;

declare function TasButtonListAddData(object: tasobject, data: any): void;

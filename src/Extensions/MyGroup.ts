import { Unit } from "w3ts/index";
import { Group } from "w3ts/handles/group";

export class MyGroup extends Group {
    toList = () => {
        let units: Unit[] = [] 
        for (let uI = 0; uI < this.size; uI++) {
            units.push(this.getUnitAt(uI))
        }
        return units;
    }

    forEach = (callback: (unit: Unit) => void) => {
        this.toList().forEach((x: Unit) => callback(x))
    }

    public static fromHandle(handle: group): MyGroup {
        return this.getObject(handle);
    }
}

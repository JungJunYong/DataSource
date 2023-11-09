import { ObserverObject} from "./ObserverObject";
import {v4 as uuidv4} from 'uuid';
import {_} from "lodash";
import EventEmitter from "EventEmitter"

export default class ProxyObject<T extends object = object> {
    constructor(dataObject: T, changeHandler?: (uid: string) => void){
        const EVENT = new EventEmitter();
        EVENT.on('change', changeHandler);
        return new ObserverObject<T>(dataObject, {
            state: {
                isNew: false,
                changed: false,
                uid: uuidv4(),
                originals: _.cloneDeep(dataObject),
                deleted: false
            },
            get: function (target, prop, receiver) {
                if (!Reflect.has(target, prop)) {
                    return this.state[prop]
                }
                return Reflect.get(target, prop, receiver);
            },
            set: function (target, prop, value, receiver): boolean {
                const isUpdate = target[prop] !== value
                const tempObj = _.cloneDeep(target);
                tempObj[prop] = value;
                this.state.changed = !_.isEqual(tempObj, this.state.originals);
                Reflect.set(target, prop, value, receiver);
                if (isUpdate) {
                    EVENT.emit("change", this.state.uid)
                }
                return true
            }
        })
    }
}

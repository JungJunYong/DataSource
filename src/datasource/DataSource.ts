import EventEmitter from "EventEmitter"
import ProxyObject from "../proxy/ProxyObject";
import {ObjectState} from "../proxy/ObserverObject";
import Api from "../api";
import {AxiosRequestConfig} from "axios";

export type APITYPE = 'get' | 'post' | 'put' | 'delete';

export default class DataSource<T extends object> {
    constructor(url: string, type: APITYPE = 'get', config?: AxiosRequestConfig) {
        this.url = url;
        this.config = config;
        this.type = type;
    }

    type: APITYPE = 'get';
    config: any;
    url: string | undefined;
    _data: Array<ProxyObject<T>> = [];
    #EVENT = new EventEmitter()

    get data() {
        return this._data.filter((item: ProxyObject<T>) => !(item as ObjectState<T>).deleted)
    }

    delete(uid: string) {
        (this._data.find((item: ProxyObject<T>) => (item as ObjectState<T>).uid === uid) as ObjectState<T>).deleted = true
        this.#EVENT.emit("delete", this.data)
        return uid;
    }

    add(dataObject: T) {
        const data = new ProxyObject(dataObject, (uid: string) => {
            this.#EVENT.emit("update", this.data.find((item: ProxyObject<T>) => (item as ObjectState<T>).uid === uid))
        }) as ObjectState<T>
        data.isNew = true
        this._data.push(data)
        this.#EVENT.emit("add", this.data)
        return data;
    }

    getDirtyData() {
        return {
            updated: this._data.filter((item: ProxyObject<T>) => (item as ObjectState<T>).changed),
            added: this._data.filter((item: ProxyObject<T>) => (item as ObjectState<T>).isNew),
            deleted: this._data.filter((item: ProxyObject<T>) => (item as ObjectState<T>).deleted)
        }
    }

    async read() {
        const api = {get: Api.get, post: Api.post, put: Api.put, delete: Api.delete}
        const dataList = await api[this.type](this.url, this.config) as unknown as Array<T>
        this._data = dataList.map((dataObject: T) => {
            return new ProxyObject(dataObject, (uid: string) => {
                this.#EVENT.emit("update", this.data.find((item: ProxyObject<T>) => (item as ObjectState<T>).uid === uid))
            });
        })
        return this._data;
    }


    addEventListener(event: "change" | "add" | "delete", callback: (data: Array<ProxyObject<T>>) => void) {
        this.#EVENT.on(event, callback)
    }

}
export class ProxyObject<T extends object>{
    constructor(target: T, handler: HandlerI<T>) {
        return new Proxy(target, handler)
    }
}

interface HandlerI<T extends object> extends ProxyHandler<T> {
    state: ObjectState<T>;
}

export class ObjectState<T extends object>{
    isNew: boolean;
    changed: boolean;
    uid?: string;
    originals: T;
    deleted: boolean
}
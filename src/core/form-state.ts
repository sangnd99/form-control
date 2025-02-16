/* ##### TYPES ##### */
type TDefineObject = Record<string, unknown>
type TSubscribeHandlers<T> = (record: T) => void

/* ##### CONSTANT ##### */
const SUBSCRIBES = new WeakMap<TDefineObject, Map<string, TSubscribeHandlers<unknown>[]>>()
const PROXY_CACHED = new WeakMap<object, object>()

/* ##### HELPER FUNCTIONS ##### */
function canSubscribe(target: unknown) {
    if (target === null || target === undefined) {
        return false
    }

    if (target.constructor && !['Object'].includes(target.constructor.name)) {
        return false
    }

    return true
}

/* ##### CORE FUNCTIONS ##### */
function proxy<ProxifyObject extends TDefineObject>(obj: ProxifyObject): ProxifyObject {
	if (PROXY_CACHED.has(obj)) {
		return PROXY_CACHED.get(obj) as ProxifyObject
	}

    const handlers = new Map<string, TSubscribeHandlers<unknown>[]>()

    const proxyHandler: ProxyHandler<ProxifyObject> = {
        get(target, p: string, receiver) {
            // If an object is passed, proxify it
            const record = target[p]
            if (canSubscribe(record)) {
                return proxy(record as ProxifyObject)
            }
            return Reflect.get(target, p, receiver)
        },
        set(target, p: string, newValue, receiver) {
            const prevValue = target[p]
            // Do nothing if new value is equal to old value
            if (prevValue === newValue) {
                return true
            }
            // get handlers by target
            const handlers = SUBSCRIBES.get(receiver)?.get(p)
            if (handlers) {
                handlers.forEach((handler) => handler(newValue))
            }
            Reflect.set(target, p, newValue, receiver)
            return true
        }
    }
    const result = new Proxy(obj, proxyHandler)
	PROXY_CACHED.set(obj, result)
    SUBSCRIBES.set(result, handlers)

    return result
}

function subscribe<T extends TDefineObject, K extends keyof T>(target: T, field: K, handler: TSubscribeHandlers<T[K]>) {
    let fieldSubscribed = SUBSCRIBES.get(target)
    if (fieldSubscribed) {
        const handlers = fieldSubscribed.get(field as string) ?? []
        handlers.push(handler as TSubscribeHandlers<unknown>)
        fieldSubscribed.set(field as string, handlers)
    } else {
        fieldSubscribed = new Map()
        fieldSubscribed.set(field as string, [handler as TSubscribeHandlers<unknown>])
    }
    SUBSCRIBES.set(target, fieldSubscribed)
}

export { proxy, subscribe }

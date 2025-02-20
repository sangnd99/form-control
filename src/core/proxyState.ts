import { TDefineObject } from './types'

/* ##### TYPES ##### */
type TPlainObject = Record<string, unknown> & InstanceType<typeof Object>
type TSubscribeHandlers<T> = (record: T) => void

/* ##### CONSTANT ##### */
const SUBSCRIBERS = new WeakMap<TDefineObject, Map<string, Set<TSubscribeHandlers<unknown>>>>()
const PROXY_CACHED = new WeakMap<object, object>()

/* ##### HELPER FUNCTIONS ##### */
function canProxify(target: unknown) {
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
    const handlers = new Map<string, Set<TSubscribeHandlers<unknown>>>()

    const proxyHandler: ProxyHandler<ProxifyObject> = {
        get(target, p: string, receiver) {
            const cachedProxyObject = PROXY_CACHED.get(target[p] as object)
            if (cachedProxyObject) {
                return cachedProxyObject
            }
            return Reflect.get(target, p, receiver)
        },
        set(target, p: string, newValue, receiver) {
            const currentValue = target[p]
            const isChanged = currentValue !== newValue

            // invoke handlers for target
            // only invoke when new value is changed
            if (isChanged) {
                const cachedProxyTarget = PROXY_CACHED.get(target as object)
                const handlers = SUBSCRIBERS.get(cachedProxyTarget as ProxifyObject)?.get(p)
                if (handlers) {
                    handlers.forEach((fn) => fn(newValue))
                }
            }
            // if new value can be proxified
            if (canProxify(newValue)) {
                // proxify value
                const newProxifyValue = proxy(newValue as ProxifyObject)
                // remove deprecated subscribe
                const deprecatedProxifyValue = PROXY_CACHED.get(currentValue as TDefineObject)
                if (deprecatedProxifyValue) {
                    // assign subcribe to new value
                    const subscribe = SUBSCRIBERS.get(deprecatedProxifyValue as ProxifyObject)
                    if (subscribe && subscribe.size > 0) {
                        SUBSCRIBERS.set(newProxifyValue, subscribe)
                        subscribe.forEach((handlers, field) => {
                            if (handlers.size > 0) {
                                // only invoke subsciber which has handler and its value is changed
                                if ((currentValue as TDefineObject)[field] !== newValue[field]) {
                                    handlers.forEach((fn) => fn(newValue[field]))
                                }
                            }
                        })
                    }
                    // remove deprecated subscribe
                    if (isChanged) {
                        SUBSCRIBERS.delete(deprecatedProxifyValue as ProxifyObject)
                        PROXY_CACHED.delete(currentValue as TDefineObject)
                    }
                }
            }

            Reflect.set(target, p, newValue, receiver)
            return true
        }
    }
    const result = new Proxy(obj, proxyHandler)
    PROXY_CACHED.set(obj, result)

    for (const key in obj) {
        result[key] = obj[key]
        handlers.set(key, new Set())
    }

    SUBSCRIBERS.set(result, handlers)

    return result
}

function subscribe<T extends TPlainObject, K extends keyof T>(target: T, field: K, handler: TSubscribeHandlers<T[K]>) {
    const fieldSubscribed = SUBSCRIBERS.get(target)
    if (fieldSubscribed) {
        const handlers = fieldSubscribed.get(field as string) ?? new Set<TSubscribeHandlers<unknown>>()
        if (!handlers.has(handler as TSubscribeHandlers<unknown>)) {
            handlers.add(handler as TSubscribeHandlers<unknown>)
            fieldSubscribed.set(field as string, handlers)
            SUBSCRIBERS.set(target, fieldSubscribed)
        }
    }
}

function deproxy<T extends TDefineObject>(obj: T): T {
    return Object.fromEntries(
        Object.entries(Object.assign({}, obj)).map(([key, value]) => {
            if (value instanceof Object) {
                if (!canProxify(value)) {
                    return [key, value]
                }
                return [key, deproxy(value as T)]
            }
            return [key, value]
        })
    ) as T
}

export { proxy, deproxy, subscribe }

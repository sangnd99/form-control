import { deepEqual } from '../utils/deepEqual'
import { TDefineObject } from './types'

/* ##### TYPES ##### */
type TPlainObject = Record<string, unknown> & InstanceType<typeof Object>
type TSubscribeHandlers<T> = (record: T) => void

/* ##### CONSTANT ##### */
const SUBSCRIBERS = new WeakMap<TDefineObject, Map<string, Set<TSubscribeHandlers<unknown>>>>()
const PROXY_CACHED = new WeakMap<object, object>()
const TO_BE_NOTIFIED = new Set<TSubscribeHandlers<unknown>>()

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

// Batching notifier
function flush(params: unknown) {
    return function () {
        TO_BE_NOTIFIED.forEach((fn) => fn(params))
        TO_BE_NOTIFIED.clear()
    }
}

function notify(fn: TSubscribeHandlers<unknown>, params: unknown) {
    TO_BE_NOTIFIED.add(fn)
    Promise.resolve().then(flush(params))
}

/* ##### CORE FUNCTIONS ##### */
function proxy<ProxifyObject extends TDefineObject>(obj: ProxifyObject): ProxifyObject {
    if (PROXY_CACHED.has(obj)) {
        /**
         * Obj: {foo: {bar: 'baz'}}
         * Example:
         * when doing
         * obj.foo.bar = 'something'
         * the `get` trap still be called for `foo` property
         * so that, we need to cached the handler of `foo` property and return if has
         * than re-create a new instance of Proxy for `foo`
         * if does that, the SUBSCRIBERS of `foo` will never be corrected
         * */
        return PROXY_CACHED.get(obj) as ProxifyObject
    }

    const handlers = new Map<string, Set<TSubscribeHandlers<unknown>>>()

    const proxyHandler: ProxyHandler<ProxifyObject> = {
        get(target, p: string, receiver) {
            // If an object is passed, proxify it
            const record = target[p]
            if (canProxify(record)) {
                return proxy(record as ProxifyObject)
            }
            return Reflect.get(target, p, receiver)
        },
        set(target, p: string, newValue, receiver) {
            const prevValue = target[p]
            // Do nothing if new value is equal to old value
            if (deepEqual(prevValue, newValue)) {
                return true
            }
			// remove old subscribe if has set new value
			if (PROXY_CACHED.has(target[p] as object)) {
				const deprecatedSubscriber = PROXY_CACHED.get(target[p] as object)
				if (deprecatedSubscriber) {
					SUBSCRIBERS.delete(deprecatedSubscriber as TDefineObject)
				}
			}
            // get handlers by target
            const handlers = SUBSCRIBERS.get(receiver)?.get(p)
            if (handlers) {
                handlers.forEach((handler) => notify(handler, newValue))
            }
            Reflect.set(target, p, newValue, receiver)
            return true
        }
    }
    const result = new Proxy(obj, proxyHandler)
    PROXY_CACHED.set(obj, result)
    SUBSCRIBERS.set(result, handlers)

    return result
}

function subscribe<T extends TPlainObject, K extends keyof T>(target: T, field: K, handler: TSubscribeHandlers<T[K]>) {
    let fieldSubscribed = SUBSCRIBERS.get(target)
    if (fieldSubscribed) {
        const handlers = fieldSubscribed.get(field as string) ?? new Set<TSubscribeHandlers<unknown>>()
        if (!handlers.has(handler as TSubscribeHandlers<unknown>)) {
            handlers.add(handler as TSubscribeHandlers<unknown>)
            fieldSubscribed.set(field as string, handlers)
        }
    } else {
        fieldSubscribed = new Map()
        const handlers = new Set<TSubscribeHandlers<unknown>>()
        fieldSubscribed.set(field as string, handlers.add(handler as TSubscribeHandlers<unknown>))
    }
    SUBSCRIBERS.set(target, fieldSubscribed)
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

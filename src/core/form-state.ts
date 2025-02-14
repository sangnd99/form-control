/* ##### TYPES ##### */
type TDefineObject = Record<string, unknown>

/* ##### CONSTANT ##### */
const subscribes = new WeakMap()
const a = new Map()

/* ##### HELPER FUNCTIONS ##### */
function canProxify(target: unknown) {
    if (target === null || target === undefined) {
        return false
    }

    if (target.constructor && !['Object', 'Array'].includes(target.constructor.name)) {
        return false
    }

    return true
}

/* ##### CORE FUNCTIONS ##### */

// const result = {}
// for (let [key, value] of Object.entries(obj)) {
//     if (canProxify(value)) {
//         // ;(obj as TDefineObject)[key] = proxy(value as TDefineObject)
//         // continue
//     }
// }
function proxy<ProxifyObject extends TDefineObject>(obj: ProxifyObject): ProxifyObject {
    const handlers = new Map<string, (value: unknown) => void>()

    const proxyHandler: ProxyHandler<ProxifyObject> = {
        get(target, p: string, receiver) {
            return Reflect.get(target, p, receiver)
        },
        set(target, p, newValue, receiver) {
            console.log('handler > set: ', target, p)
            Reflect.set(target, p, newValue, receiver)
            return true
        }
    }
    const result = new Proxy(obj, proxyHandler)

    subscribes.set(result, handlers)

    console.log('subscribes: ', subscribes)

    return result
}

function subscribe<T extends TDefineObject>(target: T, field: keyof T, handler: (record: unknown) => void) {}

export { proxy, subscribe }

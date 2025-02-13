/* ##### CONSTANT ##### */
const subscribes = new WeakMap()

/* ##### CORE FUNCTION ##### */
function proxy<ProxifyObject extends Record<string, unknown>>(object: ProxifyObject) {
    for (let [key, value] of Object.entries(object)) {
        console.log('entries: ', key, value)
    }
}

function subscribe(target: unknown, handler: (record: unknown) => void) {}

export { proxy, subscribe }

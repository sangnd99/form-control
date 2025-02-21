import { TValidationFunction, TValidationResponse, TDefineObject } from './types'

async function invokeValidate<Value, WatchValue>(
    rules: TValidationFunction[],
    value: Value,
    watchValue: WatchValue
): Promise<TValidationResponse> {
    let result: TValidationResponse = {
        isValid: true,
        msg: ''
    }
    for (const validationFn of rules) {
        const response: TValidationResponse = await validationFn(value, watchValue)
        if (!response.isValid) {
            result = response
            break
        }
    }
    return result
}

async function validateFields<
    Values extends TDefineObject,
    Key extends keyof Values,
    WatchKey extends Record<string, Array<keyof Values>>
>(values: Values, validations: Partial<{ [key in Key]: TValidationFunction[] }>, watches: WatchKey) {
    const result: { [key in keyof Values]?: TValidationResponse } = {}

    for (const [field, rules] of Object.entries(validations)) {
        const watchValues: Partial<{ [key in Key]?: Values[Key] }> = {}
        const fieldWatches = watches[field] ?? []

        if (fieldWatches.length > 0) {
            fieldWatches.forEach((key) => {
                Object.assign(watchValues, { [key]: values[key] })
            })
        }
        const response = await invokeValidate(rules as TValidationFunction[], values[field], watchValues)
        if (!response.isValid) {
            Object.assign(result, { [field]: response })
        }
    }

    return result
}

export { validateFields, invokeValidate }

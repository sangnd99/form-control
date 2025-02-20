import { TValidationFunction, TValidationResponse, TDefineObject } from './types'

function validateFields<
    Values extends TDefineObject,
    Key extends keyof Values,
    WatchKey extends Record<string, Array<keyof Values>>
>(values: Values, validations: Partial<{ [key in Key]: TValidationFunction[] }>, watches: WatchKey) {
    const result: { [key in keyof Values]?: TValidationResponse } = {}

    Object.entries(validations).forEach(([field, rules]) => {
        for (const validationFn of rules as TValidationFunction[]) {
            const watchValues: Partial<{ [key in Key]?: Values[Key] }> = {}
            const fieldWatches = watches[field] ?? []

            if (fieldWatches.length > 0) {
                fieldWatches.forEach((key) => {
                    Object.assign(watchValues, { [key]: values[key] })
                })
            }

            const response: TValidationResponse = validationFn(values[field as Key], watchValues)
            if (!response.isValid) {
                Object.assign(result, { [field]: response })
                break
            }
        }
    })

    return result
}

export { validateFields }

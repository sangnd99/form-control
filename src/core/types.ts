type TDefineObject = Record<string, unknown>

type TValidationResponse = { isValid: boolean; msg: string }
type TValidationFunction = <Value, WatchValue>(value: Value, watchValue?: WatchValue) => TValidationResponse

type TFormController<Values extends TDefineObject> = {
    values: Values
    errors: { [key in keyof Values]?: TValidationResponse }
    watches: Record<keyof Values, Array<keyof Values>>
    touches: (keyof Values)[]
}

export type { TDefineObject, TFormController, TValidationFunction, TValidationResponse }

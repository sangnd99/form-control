type TDefineObject = Record<string, unknown>

type TValidationResponse = { isValid: boolean; msg: string }
type TValidationFunction = <Value, WatchValue>(value: Value, watchValue?: WatchValue) => Promise<TValidationResponse> | TValidationResponse

type TFormController<Values extends TDefineObject> = {
    values: Values
    errors: { [key in keyof Values]?: TValidationResponse }
    watches: Record<keyof Values, Array<keyof Values>>
    touched: Set<keyof Values>
    validations: Partial<{ [key: string]: TValidationFunction[] }>
}

export type { TDefineObject, TFormController, TValidationFunction, TValidationResponse }

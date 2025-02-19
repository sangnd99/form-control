type TDefineObject = Record<string, unknown>

type TValidationFunction = <Value, WatchValue>(value: Value, watchValue?: WatchValue) => {isValid: boolean, msg: string}

type TFormController<Values extends TDefineObject> = {
    values: Values
    errors: Array<keyof Values>
	watches: Record<keyof Values, Partial<Values>>
	touches: (keyof Values)[]
	requestValidateSchema: boolean
}

export type { TDefineObject, TFormController, TValidationFunction }

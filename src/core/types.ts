type TDefineObject = Record<string, unknown>

type TFormController<Values extends TDefineObject> = {
    values: Values
    errors: Partial<Record<keyof Values, string>>[]
	touches: (keyof Values)[]
}

export type { TDefineObject, TFormController }

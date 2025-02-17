import { proxy } from './proxyState'

type TFormState = {
    values: Record<string, unknown>
    errors: Partial<Record<string, string>>[]
}

const formState = proxy<TFormState>({
	values: {},
	errors: []
})

export { formState }

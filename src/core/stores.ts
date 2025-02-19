import { proxy } from './proxyState'
import { TFormController, TDefineObject } from './types'

const formController = proxy<TFormController<TDefineObject>>({
    values: {},
    errors: [],
	touches: [],
	watches: {},
	requestValidateSchema: false,
})

export { formController }

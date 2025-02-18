import { proxy } from './proxyState'
import { TFormController, TDefineObject } from './types'

const formController = proxy<TFormController<TDefineObject>>({
    values: {},
    errors: [],
	touches: []
})

export { formController }

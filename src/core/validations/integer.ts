import { TValidationFunction } from '../types'
import { renderError } from './errorHelpers'

function interger(msg: string): TValidationFunction {
    const error = renderError('interger')
    return function (value) {
        if (!value) {
            throw new Error(error.empty)
        }
        if (typeof value !== 'number') {
            throw new Error(error.notValid)
        }
        if (!Number.isInteger(value)) {
            return {
                isValid: false,
                msg: msg
            }
        }
        return {
            isValid: true,
            msg: ''
        }
    }
}

export { interger }

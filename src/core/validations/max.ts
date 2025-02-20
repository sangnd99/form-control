import { TValidationFunction } from '../types'
import { renderError } from './errorHelpers'

function max(limit: number, msg: string): TValidationFunction {
    const error = renderError('max')
    return function (value) {
        if (!value) {
            throw new Error(error.empty)
        }
        if (value.constructor && value.constructor.name === 'Object') {
            throw new Error(error.notValid)
        }
        if (Array.isArray(value) && value.length > limit) {
            return {
                isValid: false,
                msg: msg
            }
        }
        if (typeof value === 'string' && value.trim().length > limit) {
            return {
                isValid: false,
                msg: msg
            }
        }
        if (typeof value === 'number' && value > limit) {
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

export { max }

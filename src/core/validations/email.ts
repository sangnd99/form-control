import { TValidationFunction } from '../types'
import { renderError } from './errorHelpers'

const EMAIL_REGEX = new RegExp('^[^s@]+@[^s@]+.[^s@]{2,}$')

function email(msg: string): TValidationFunction {
    const error = renderError('email')

    return function (value) {
        if (!value) {
            throw new Error(error.empty)
        }
        if (typeof value === 'object') {
            throw new Error(error.notValid)
        }
        if (!EMAIL_REGEX.test(String(value).trim())) {
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

export { email }

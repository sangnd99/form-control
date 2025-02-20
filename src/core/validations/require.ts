import { TValidationFunction } from '../types'

function require(msg: string): TValidationFunction {
    return function (value) {
        // primitive value and nullish
        if (!value) {
            return {
                isValid: false,
                msg: msg
            }
        }
        // array
        if (Array.isArray(value) && value.length === 0) {
            return {
                isValid: false,
                msg: msg
            }
        }
        // plain object
        if (value.constructor && value.constructor.name === 'Object' && Object.keys(value).length === 0) {
            return {
                isValid: false,
                msg: msg
            }
        }
        // string
        if (typeof value === 'string' && value.trim() === '') {
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

export { require }

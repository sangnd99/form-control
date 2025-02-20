import { TValidationFunction } from '../types'
import { renderError } from './errorHelpers'

const PROTOCOLS = ['http:', 'https:', 'ftp:']
function url(msg: string): TValidationFunction {
    const error = renderError('url')
    return function (value) {
        if (!value) {
            throw new Error(error.empty)
        }
        if (typeof value !== 'string') {
            throw new Error(error.notValid)
        }
        let url
        try {
            url = new URL(value)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            return {
                isValid: false,
                msg: msg
            }
        }
        if (!PROTOCOLS.includes(url.protocol)) {
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

export { url }

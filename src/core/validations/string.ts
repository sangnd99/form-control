import { TValidationFunction } from '../types'
import { renderError } from './errorHelpers'

type TStringValidationType = 'no-special-char' | 'only-string'

const ONLY_STRING_REGEX = new RegExp('[-0-9#@!$%^&*()_+|~=`{}[]:";\'<>?,./]')
const NO_SPECIAL_CHAR_REGEX = new RegExp('[#@!$%^&*()_+|~=`{}[]:";\'<>?,./]')

function string(condition: TStringValidationType, msg: string): TValidationFunction {
    const error = renderError('string')
    return function (value) {
        if (!value) {
            throw new Error(error.empty)
        }
        if (typeof value !== 'string') {
            throw new Error(error.notValid)
        }

        let isValid = true
        let errorMsg = ''
        switch (condition) {
            case 'only-string': {
                if (!ONLY_STRING_REGEX.test(String(value).trim())) {
                    isValid = false
                    errorMsg = msg
                }
                break
            }
            case 'no-special-char': {
                if (!NO_SPECIAL_CHAR_REGEX.test(String(value).trim())) {
                    isValid = false
                    errorMsg = msg
                }
                break
            }
        }

        return {
            isValid: isValid,
            msg: errorMsg
        }
    }
}

export { string }

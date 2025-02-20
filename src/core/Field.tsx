import React, { useState } from 'react'
import { subscribe } from './proxyState'
import { TDefineObject, TFormController, TValidationResponse } from './types'

type TFields<FormValues, Key extends keyof FormValues, WatchKey extends Array<keyof FormValues>> = {
    value: FormValues[Key]
    handleChange: (changedValue: FormValues[Key]) => void
    handleBlur?: () => void
    isError: boolean
    errorMsg: string
    setFieldValue?: <SetFieldKey extends keyof FormValues>(key: SetFieldKey, value: FormValues[SetFieldKey]) => void
    watch: Partial<Pick<FormValues, WatchKey[number]>>
}

interface IFieldProps<FormValues, Key extends keyof FormValues, WatchKey extends Array<keyof FormValues>> {
    children: (field: TFields<FormValues, Key, WatchKey>) => React.JSX.Element | React.ReactNode
}

interface IProps<
    FormValues extends TDefineObject,
    Key extends keyof FormValues,
    Controller extends TFormController<FormValues>,
    WatchKey extends Array<keyof FormValues>
> extends IFieldProps<FormValues, Key, WatchKey> {
    name: Key
    watch?: WatchKey
    controller: Controller
}

const Field = <
    FormValues extends TDefineObject,
    Key extends keyof FormValues,
    WatchKey extends Array<keyof FormValues>
>({
    name,
    watch,
    controller,
    children
}: IProps<FormValues, Key, TFormController<FormValues>, WatchKey>) => {
    /*
     * Variables
     * */
    /*
     * State
     * */
    const [value, setValue] = useState<FormValues[Key]>(controller.values[name])
    const [watchRecord, setWatchRecord] = useState<Record<string, unknown>>({})
    const [fieldError, setFieldError] = useState<TValidationResponse | undefined>(undefined)

    /*
     * Assign value to form controller
     * */
    if (watch) {
        controller.watches[name] = watch
    }

    /*
     * Subscriber
     * */
    // subscribe changed value
    subscribe(controller.values, name, setValue)
    // subscribe watch values
    if (watch && watch.length > 0) {
        watch.forEach((key) => {
            subscribe(controller.values, key, (value) => setWatchRecord((prev) => ({ ...prev, [key]: value })))
        })
    }
    // subscribe error
    subscribe(controller.errors, name, (error) => console.log(name, ': ', error))

    /*
     * Handlers
     * */
    const handleChangeValue = (changedValue: FormValues[Key]) => {
        controller.values[name] = changedValue
    }

    return (
        <div>
            {children({
                value: value,
                handleChange: handleChangeValue,
                watch: watchRecord as FormValues,
                errorMsg: fieldError?.msg ?? '',
                isError: fieldError?.isValid !== undefined && !fieldError.isValid
            })}
        </div>
    )
}

export default Field
export type { IFieldProps }

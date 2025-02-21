import React, { useState } from 'react'
import { subscribe } from './proxyState'
import { TDefineObject, TFormController, TValidationResponse } from './types'
import { invokeValidate } from './helpers'

type TFields<FormValues, Key extends keyof FormValues, WatchKey extends Array<keyof FormValues>> = {
    value: FormValues[Key]
    handleChange: (changedValue: FormValues[Key]) => Promise<void> | void
    isError: boolean
    errorMsg: string
    watch: Partial<Pick<FormValues, WatchKey[number]>>
    setFieldValue: <SetFieldKey extends keyof FormValues>(
        field: SetFieldKey,
        changedValue: FormValues[SetFieldKey]
    ) => Promise<void> | void
    handleBlur: () => void
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
    console.log(name, 'is re-render with changed value: ', value)

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
    subscribe(controller.errors, name, setFieldError)

    /*
     * Handlers
     * */
    // set current field value
    const handleChangeValue = async (changedValue: FormValues[Key]) => {
        controller.values[name] = changedValue
        if (controller.touched.has(name)) {
            const validateFns = controller.validations[name as string] ?? []
            const response = await invokeValidate(validateFns, changedValue, watchRecord)
            controller.errors[name] = response
        }
    }

    // set others field value
    const handleSetFieldValue = async <Key extends keyof FormValues>(field: Key, changedValue: FormValues[Key]) => {
        controller.values[field] = changedValue
        if (controller.touched.has(field)) {
            const fieldWatchedValues: TDefineObject = {}
            const fieldWatched = controller.watches[field] ?? []
            fieldWatched.forEach((field) => {
                Object.assign(fieldWatchedValues, { [field]: controller.values[field] })
            })
            const validateFns = controller.validations[field as string] ?? []
            const response = await invokeValidate(validateFns, changedValue, fieldWatchedValues)
            controller.errors[field] = response
        }
    }

    const handleBlurField = () => {
        controller.touched.add(name)
    }

    return (
        <div>
            {children({
                value: value,
                handleChange: handleChangeValue,
                watch: watchRecord as FormValues,
                errorMsg: fieldError?.msg ?? '',
                isError: fieldError?.isValid !== undefined && !fieldError.isValid,
                handleBlur: handleBlurField,
                setFieldValue: handleSetFieldValue
            })}
        </div>
    )
}

export default Field
export type { IFieldProps }

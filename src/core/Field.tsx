import React, { useState } from 'react'
import { subscribe } from './proxyState'
import { TDefineObject, TFormController, TValidationFunction } from './types'

type TFields<FormValues, Key extends keyof FormValues, WatchKey extends Array<keyof FormValues>> = {
    value: FormValues[Key]
    handleChange: (changedValue: FormValues[Key]) => void
    handleBlur?: () => void
    isError?: boolean
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

    /*
     * Subscriber
     * */
    // subscribe initial value
    subscribe(controller, 'values', (values) => {
        // initial current value
        setValue(values[name])
        // initial watch record
        if (watch && watch.length > 0) {
            const watchRecord = {}
            watch.forEach((key) => {
                Object.assign(watchRecord, { [key]: values[key] })
            })
            // assign to Field state
            setWatchRecord(watchRecord)
            // assign to Controller
            Object.assign(controller.watches, { [name]: watchRecord })
        }
    })
    // subscribe changed value
    subscribe(controller.values, name, setValue)
    // subscribe watch values
    if (watch && watch.length > 0) {
        watch.forEach((key) => {
            subscribe(controller.values, key, (value) => {
                // assign to Field state
                setWatchRecord((prev) => ({ ...prev, [key]: value }))
                // assign to Controller
                controller.watches[key] = { ...controller.watches[key], [key]: value }
            })
        })
    }

    /*
     * Effects
     * */

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
                watch: watchRecord as FormValues
            })}
        </div>
    )
}

export default Field
export type { IFieldProps }

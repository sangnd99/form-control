import React, { useEffect, useState } from 'react'
import { TDefineObject, TFormController } from './types'
import { subscribe } from './proxyState'

type TFields<FormValues extends TDefineObject, Key extends keyof FormValues> = {
    value: FormValues[Key]
    handleChange: (changedValue: FormValues[Key]) => void
    handleBlur?: () => void
    isError?: boolean
    setFieldValue?: <SetFieldKey extends keyof FormValues>(key: SetFieldKey, value: FormValues[SetFieldKey]) => void
}

interface IFieldProps<FormValues extends TDefineObject, Key extends keyof FormValues> {
    children: (field: TFields<FormValues, Key>) => React.JSX.Element | React.ReactNode
}

interface IProps<
    FormValues extends TDefineObject,
    Key extends keyof FormValues,
    Controller extends TFormController<FormValues>
> extends IFieldProps<FormValues, Key> {
    name: Key
    controller: Controller
}

const Field = <FormValues extends TDefineObject, Key extends keyof FormValues>({
    name,
    controller,
    children
}: IProps<FormValues, Key, TFormController<FormValues>>) => {
    /*
     * Variables
     * */
    /*
     * State
     * */
    const [value, setValue] = useState<FormValues[Key]>(controller.values[name])

    /*
     * Subscriber
     * */
    // subscribe initial value
    subscribe(controller, 'values', (values) => setValue(values[name]))
    // subscribe changed value
    subscribe(controller.values, name, setValue)

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
                handleChange: handleChangeValue
            })}
        </div>
    )
}

export default Field
export type { IFieldProps }

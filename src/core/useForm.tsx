import React, { useEffect, useRef } from 'react'
import { deproxy } from './proxyState'
import { formController } from './stores'
import { TDefineObject, TFormController, TValidationFunction } from './types'
import { validateFields } from './helpers'

interface IParams<Value> {
    defaultValue: Value
    validations?: Partial<{ [key in keyof Value]: TValidationFunction[] }>
    onSubmit: (values: Value) => Promise<void> | void
}

interface IReturns<FormValues extends TDefineObject> {
    ref: React.RefObject<HTMLFormElement | null>
    controller: TFormController<FormValues>
}

function useForm<DefaultValue extends TDefineObject>(params: IParams<DefaultValue>): IReturns<DefaultValue> {
    /*
     * Initial
     * */
    // destructure params
    const { onSubmit, defaultValue, validations } = params

    // set form initial values
    formController.values = defaultValue
    if (validations) {
        formController.validations = validations
    }

    /*
     * Refs
     * */
    const formRef = useRef<HTMLFormElement>(null)

    /*
     * Effects
     * */
    // submit handler
    useEffect(() => {
        if (formRef.current) {
            async function handleSubmit(e: SubmitEvent) {
                e.preventDefault()
                e.stopPropagation()

                // if user submit, set touched to all fields
                formController.touched = new Set(Object.keys(formController.values))
                // validating
                if (validations && Object.keys(validations).length > 0) {
                    // do nothing if contains errors
                    const fieldErrors = await validateFields(
                        formController.values as DefaultValue,
                        validations,
                        formController.watches
                    )
                    formController.errors = fieldErrors
                    if (Object.keys(fieldErrors).length > 0) {
                        // do nothing if contain errors
                        return
                    }
                }
                // submit values
                onSubmit(deproxy(formController.values) as DefaultValue)
            }
            formRef.current.addEventListener('submit', handleSubmit)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ref: formRef,
        controller: formController as TFormController<DefaultValue>
    }
}

export { useForm }

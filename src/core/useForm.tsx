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
            function handleSubmit(e: SubmitEvent) {
                e.preventDefault()
                e.stopPropagation()

                // validating
                if (validations && Object.keys(validations).length > 0) {
                    // do nothing if contains errors
                    const fieldErrors = validateFields(
                        formController.values as DefaultValue,
                        validations,
                        formController.watches
                    )
                    if (Object.keys(fieldErrors).length > 0) {
                        console.log('fieldErrors: ', fieldErrors)
                        formController.errors = fieldErrors
                        // Object.entries(fieldErrors).forEach(([field, error]) => {
                        //     formController.errors[field] = error
                        // })
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

import React, { useEffect, useRef } from 'react'
import { deproxy } from './proxyState'
import { formController } from './stores'
import { TDefineObject, TFormController } from './types'

interface IParams<Value> {
    defaultValue: Value
    validations?: { [key in keyof Value]?: unknown }
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
    const { onSubmit, defaultValue } = params

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

                // do nothing if contains errors
                if (formController.errors.length > 0) {
                    return
                }
				// validating
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

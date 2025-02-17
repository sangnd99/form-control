import React, { useEffect, useRef } from 'react'
import { useShallowEffect } from '../hooks'
import Field, { IFieldProps } from './Field'
import { formState } from './stores'

interface IParams<V> {
    defaultValue: V
    validations: unknown
    onSubmit: (values: V) => Promise<void> | void
}

interface IReturns<V extends string> {
    Field: <K extends V>(props: { name: K } & IFieldProps) => React.JSX.Element
    ref: React.RefObject<HTMLFormElement | null>
}

function useForm<DefaultValue extends Record<string, unknown>>(
    params: IParams<DefaultValue>
): IReturns<Extract<keyof DefaultValue, string>> {
    // variables
    const { onSubmit, defaultValue } = params

    // refs
    const formRef = useRef<HTMLFormElement>(null)

    // effects
    // set default values
    useShallowEffect(() => {
		formState.values = defaultValue
		console.log('formState: ', formState.values)
	}, [defaultValue])

    // submit handler
    useEffect(() => {
        if (formRef.current) {
            function handleSubmit(e: SubmitEvent) {
                e.preventDefault()
                e.stopPropagation()
                onSubmit({} as DefaultValue)
            }
            formRef.current.addEventListener('submit', handleSubmit)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        Field: (props) => <Field {...props} />,
        ref: formRef
    }
}

export { useForm }

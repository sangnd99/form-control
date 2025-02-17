import React from 'react'

interface IFieldProps {
    children?: React.JSX.Element | React.ReactNode
}

interface IProps<Key> extends IFieldProps {
    name: Key
}
const Field = <Key extends string>({ name, children }: IProps<Key>) => {
    return <div>Field</div>
}

export default Field
export type { IFieldProps }

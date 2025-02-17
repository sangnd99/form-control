import { useEffect, useRef } from 'react'
import { deepEqual } from '../utils/deepEqual'

function shallowCompare(prevValue?: React.DependencyList | null, currValue?: React.DependencyList) {
    if (!prevValue || !currValue) {
        return false
    }

    if (prevValue === currValue) {
        return true
    }

    if (prevValue.length !== currValue.length) {
        return false
    }

    for (let i = 0; i < prevValue.length; i += 1) {
        if (!deepEqual(prevValue[i], currValue[i])) {
            return false
        }
    }

    return true
}

function useShallowCompare(dependencies?: React.DependencyList) {
    const ref = useRef<React.DependencyList | null | undefined>([])
    const updateRef = useRef<number>(0)

    if (!shallowCompare(ref.current, dependencies)) {
        ref.current = dependencies
        updateRef.current += 1
    }

    return [updateRef.current]
}

export function useShallowEffect(cb: () => void, dependencies?: React.DependencyList): void {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(cb, useShallowCompare(dependencies))
}

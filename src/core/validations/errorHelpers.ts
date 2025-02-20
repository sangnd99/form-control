function renderError(target: string) {
    return {
        empty: target + ': Value is empty!',
        notValid: target + ': Value is not valid'
    }
}

export { renderError }

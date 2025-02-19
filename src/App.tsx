import { useEffect, useState } from 'react'
import { useForm, FormField } from './core'
function App() {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        remember: false
    })

    useEffect(() => {
        ;(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setFormValues({
                email: 'example@yopmail.com',
                password: 'afdsfafdsaf',
                remember: true
            })
        })()
    }, [])

    const { controller, ref } = useForm({
        defaultValue: {
            email: formValues.email ?? '',
            password: formValues.password ?? '',
            remember: formValues.remember ?? false
        },
        validations: { email: [], password: [], remember: [] },
        onSubmit(values) {
            console.log('submited: ', values)
        }
    })
    return (
        <div className="p-4">
            <form className="max-w-sm mx-auto" ref={ref}>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                    </label>
                    <FormField name="email" watch={['remember']} controller={controller}>
                        {({ value, handleChange, watch }) => {
                            console.log('remember: ', watch.remember)
                            return (
                                <input
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@flowbite.com"
                                    value={value}
                                    onChange={(e) => handleChange(e.target.value)}
                                    style={{
                                        borderColor: watch.remember ? 'blue' : undefined
                                    }}
                                />
                            )
                        }}
                    </FormField>
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your password
                    </label>
                    <FormField controller={controller} name="password">
                        {(field) => {
                            return (
                                <input
                                    type="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={field.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            )
                        }}
                    </FormField>
                </div>
                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <FormField controller={controller} name="remember">
                            {(field) => {
                                return (
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.handleChange(e.target.checked)}
                                        className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                    />
                                )
                            }}
                        </FormField>
                    </div>
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Remember me
                    </label>
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    // onClick={() => state.count++}
                    //onClick={() => {
                    //    state.count = 2
                    //}}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default App

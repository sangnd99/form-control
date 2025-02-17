import { useForm } from './core'
function App() {
    //const state = proxy({
    //    count: 0,
    //    isActive: true,
    //    info: {
    //        name: 'sang',
    //        birthDay: new Date()
    //    }
    //})
    //subscribe(state.info, 'name', (record) => console.log('name is: ', record))
    // console.log('state: ', state)
    // state.count = 2
    //state.info.name = 'name'
    const { Field, ref } = useForm({
        defaultValue: {
            name: 'sang',
            phone: '0987654321'
        },
        validations: {},
		onSubmit(values) {
			console.log('values: ', values)
		},
    })
    return (
        <div className='p-4'>
            <form className='max-w-sm mx-auto' ref={ref}>
				<Field name='phone'>hello</Field>
                <div className='mb-5'>
                    <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                        Your email
                    </label>
                    <input
                        type='email'
                        id='email'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='name@flowbite.com'
                    />
                </div>
                <div className='mb-5'>
                    <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                        Your password
                    </label>
                    <input
                        type='password'
                        id='password'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    />
                </div>
                <div className='flex items-start mb-5'>
                    <div className='flex items-center h-5'>
                        <input
                            id='remember'
                            type='checkbox'
                            value=''
                            className='w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
                        />
                    </div>
                    <label htmlFor='remember' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Remember me
                    </label>
                </div>
                <button
                    type='submit'
                    className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
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

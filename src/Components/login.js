import React,{useState, createRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'
import { useAuth } from './contexts/AuthContext'
const Login = () => {

  const emailRef = createRef()
  const passwordRef = createRef()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      navigate('/dashboard')
    } catch (error) {
      setError('Fail to login')
    }
    setLoading(false)
    // Navigate({replace : 'dashboard'})

  }

  return (
    <>
      <div className='w-full h-screen bg-white flex justify-center items-center flex-col'>
        <div className='absolute h-screen '>
          <img className='object-cover w-full h-full' src="https://pbs.twimg.com/media/FUFMXoYaQAAiEcZ?format=jpg&name=4096x4096" alt="" />
        </div>
        <div className=' relative w-[400px]  bg-transparent backdrop-blur-sm rounded-t-md border-2 border-white shadow-xl p-4 '>
          <h2 className='text-center text-2xl font-bold uppercase text-white'>Sign in</h2>
          {error && (<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="ml-2 block sm:inline">{error}</span>
          </div>)}
          <form className='flex justify-center align-middle flex-col child:my-1'>
            <label className='text-white' htmlFor="email">Email</label>
            <input type="email" ref={emailRef} className='outline-none border-white text-white border-2 rounded-md p-1 bg-transparent' />
            <label className='text-white' htmlFor="password">Password</label>
            <input type="password" ref={passwordRef} className='outline-none border-white text-white border-2 rounded-md p-1 bg-transparent' />
            <button className='border-white border-2 rounded-md py-2 !mt-5 text-white' onClick={(e)=>handleSubmit(e)}>
            {(loading) ?
                <svg role="status" class="inline w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg> :
                <></>}
              Login</button>
          </form>
        </div>
        <div className="bg-transparent backdrop-blur-sm duration-75 hover:cursor-pointer  w-[400px] h-[50px] relative  border-2 border-white rounded-b-md">
          <Link to="/signup" className='flex justify-center align-middle h-full text-white'> <span className='text-center leading-[43px] h-full mr-2'>Sign up now</span> <ArrowNarrowRightIcon className='w-8' /></Link>
        </div>
      </div>
    </>

  )
}

export default Login
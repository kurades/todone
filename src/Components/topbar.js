import React from 'react'
import { SearchIcon, QuestionMarkCircleIcon, BellIcon } from '@heroicons/react/outline'
import { useAuth } from './contexts/AuthContext'
const Topbar = () => {
    const {currentUser} = useAuth()
  return (
    <div className='font-sans'>
        <div className="flex h-10 justify-between mr-10">
            <div className='flex'>
                <SearchIcon className='w-6 text-gray-400' />
                <input type="text" className='p-1 outline-none border-b-2' placeholder='Search' />
            </div>
            <div className="flex justify-center items-center ">
                <QuestionMarkCircleIcon className='w-6 text-gray-400 ml-5' />
                <BellIcon className='w-6 text-gray-400ml-5 ml-5' />
                <span className='font-medium ml-5'>{currentUser.email}</span>
                <div className="w-10 ml-5 rounded-full border-2 overflow-hidden">
                    <img src="https://yt3.ggpht.com/yrCWEVmxM0XGSZSaGxgMFt4mfdRGg0-kjBQK2ue3kJZWfI1DOcb8PQ_r5n94IfNW9UQkDlDUdA=s900-c-k-c0x00ffffff-no-rj" alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Topbar
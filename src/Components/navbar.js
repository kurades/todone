import React from 'react'
import { HomeIcon, ChartBarIcon, FolderIcon, ChatAltIcon, CalendarIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline'
import { NavLink,Link,  Router } from 'react-router-dom'
const iconStyle = 'h-7 w-7 '
const navbarItem = [
  {
    icon: <HomeIcon className={iconStyle} />,
    text: 'Overview',
    path: '/',
  },
  {
    icon: <ChartBarIcon className={iconStyle} />,
    text: 'Stats',
    path: '/stats',
  },
  {
    icon: <FolderIcon className={iconStyle} />,
    text: 'Projects',
    path: '/projects',
  },
  {
    icon: <ChatAltIcon className={iconStyle} />,
    text: 'Chat',
    path: '/chat',
  },
  {
    icon: <CalendarIcon className={iconStyle} />,
    text: 'Calendar',
    path: '/calendar',
  },
]
const navbar = () => {
  return (
    <div className='fixed z-10 top-0 left-0'>
      <div className="relative w-60 h-screen shadow-xl flex flex-col justify-between pl-10 py-6">
        <h1 className='text-3xl font-medium'>.Todone</h1>

        <div className="flex flex-col my-10 ">
          {navbarItem.map((item) => (
            <NavLink key={item.text} to={item.path} className={({isActive})=> isActive? "w-full h-16 flex flex-row items-center text-black transition-colors cursor-pointer duration-150 border-r-teal-700 border-r-4" : "w-full h-16 flex flex-row items-center text-gray-400 hover:text-black transition-colors cursor-pointer duration-150" } >
              {item.icon}
              <span className='pl-4 font-medium'>{item.text}</span>
            </NavLink>
          ))}
        </div>
        
        <div className=" w-full bottom-0 pb-12 text-gray-400 font-medium ">
          <NavLink to='/setting' className={({isActive})=> isActive? "box-border w-full h-16 flex flex-row items-center  text-black transition-colors cursor-pointer duration-150 border-r-teal-700 border-r-4" : "w-full h-16 flex flex-row items-center text-gray-400 hover:text-black transition-colors cursor-pointer duration-150" }>
            <CogIcon className={iconStyle}/>
            <span className='pl-4'> Setting</span>
          </NavLink>
          <NavLink to='/signout' className={`w-full h-16 flex flex-row hover:text-black transition-colors cursor-pointer duration-150`} >
            <LogoutIcon className={iconStyle}/>
            <span className='pl-4'> Sign Out</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}
export default navbar
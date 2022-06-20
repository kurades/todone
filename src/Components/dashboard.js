import React from 'react'
import Navbar from './navbar';
import Topbar from './topbar';
import Project from './project';
const Dashboard = () => {
  return (
    <>
    <Navbar />
    <div className="ml-72 mt-10">
      <Topbar />
      <div></div>
      <Project />
    </div>
    </>
  )
}

export default Dashboard
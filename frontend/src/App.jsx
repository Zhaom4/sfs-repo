import './App.css'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
import { Routes, Route} from 'react-router-dom'
import CoursePage from './pages/customer/CoursePage'
import Favorites from './pages/customer/Favorites'
import fetchAllCourses from './services/wordpressapi'
import { useEffect, useState } from 'react'
import { CourseProvider } from './contexts/CourseContext'
import  Loader  from './components/Loader'
import MyCourses from './pages/customer/MyCourses'
// import { fetchCoursesTest } from './services/wordpressapi'

function App() {

  return (
    <CourseProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        {/* <Route path='/auth' element={<Authorization/>}/> */}
        <Route path="/mainpg" element={<MainPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path='/my-courses' element={<MyCourses/>}/>
        {/* <Route path='/testing' element={</>} /> */}
      </Routes>
    </CourseProvider>
  );
}

export default App

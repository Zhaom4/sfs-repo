import './App.css'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
import { Routes, Route} from 'react-router-dom'
import CoursePage from './pages/customer/CoursePage'
import Favorites from './pages/customer/Favorites'
import CourseSection from './pages/customer/CourseSection'
import fetchAllCourses from './services/wordpressapi'
import { useEffect, useState } from 'react'

function App() {
    const [courses, setCourses] = useState([]);
    useEffect(()=>{
      const fetchCourses = async() => {
        const results = await fetchAllCourses();
      if (results) {
        setCourses(results);
        console.log('Courses loaded:', results);
      }
      }

      fetchCourses();
    }, [])
  return (
    <>

    <Routes>
      <Route path='/' element={<WelcomePage/>}/>
      {/* <Route path='/auth' element={<Authorization/>}/> */}
      <Route path='/mainpg' element={<MainPage/>}/>
      <Route path='/course/:id' element={<CoursePage/>}/>
      <Route path='/favorites' element={<Favorites/>}/>
      <Route path='/course-section' element={<CourseSection/>}/>
    </Routes>
    </>

  )
}

export default App

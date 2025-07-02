import './App.css'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
import { Routes, Route} from 'react-router-dom'
import CoursePage from './pages/customer/CoursePage'
import Favorites from './pages/customer/Favorites'
import fetchAllCourses from './services/wordpressapi'
import { useEffect, useState } from 'react'
// import { fetchCoursesTest } from './services/wordpressapi'

export const fetchCourses = async() => {
        const results = await fetchAllCourses();
        if (results){
          return results;
        } else{
          return [];
        }
 }
function App() {
    const [courses, setCourses] = useState([]);
    useEffect(()=>{
      setCourses(fetchCourses());
    }, [])
  return (
    <>

    <Routes>
      <Route path='/' element={<WelcomePage/>}/>
      {/* <Route path='/auth' element={<Authorization/>}/> */}
      <Route path='/mainpg' element={<MainPage/>}/>
      <Route path='/course/:id' element={<CoursePage/>}/>
      <Route path='/favorites' element={<Favorites/>}/>
    </Routes>
    </>

  )
}

export default App

import './App.css'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
import { Routes, Route} from 'react-router-dom'
import CoursePage from './pages/customer/CoursePage'
import Favorites from './pages/customer/Favorites'
import { useEffect, useRef, useState } from 'react'
import { CourseProvider } from './contexts/CourseContext'
import MyCourses from './pages/customer/MyCourses'
import Donations from './pages/customer/Donations'
import gsap from 'gsap'
import { setCursor, getCursor } from './services/cursorManager'

function App() {
  const cursor = useRef();
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursor.current) {
        cursor.current.style.left = `${e.clientX}px`;
        cursor.current.style.top = `${e.clientY}px`; 
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return (
    <CourseProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/mainpg" element={<MainPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path='/my-courses' element={<MyCourses/>}/>
        <Route path='/donate' element={<Donations/>}/>
      </Routes>
      <div id='cursor' className='cursor' ref={cursor}></div>
    </CourseProvider>
  );
}

export default App
import React, { createContext, useContext, useState, useEffect } from 'react';
import fetchAllCourses from '../services/wordpressapi';

const CourseContext = createContext();

export const CourseProvider = ({children}) => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchCourses = async() => {
      const response = await fetchAllCourses();
      if (response){
        setCourseList(response.data.courses);
      }
      setLoading(false)
    };

    fetchCourses();
  }, [])

  const contextValue = {
    courseList, 
    loading
  }

  return(
    <>
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
    </>
  )
}

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context){
      throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;

}

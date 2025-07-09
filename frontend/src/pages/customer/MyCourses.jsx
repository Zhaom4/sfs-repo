import styles from '../customer/Favorites.module.css'
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import Course from '../../components/Course';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from '../../assets/sad-face.json';
import {gsap} from 'gsap';
import { useCourses } from '../../contexts/CourseContext';
import { getMyCourses } from '../../services/api';
import { decodeHtmlEntities } from '../../services/helpers';

function MyCourses(){
  const {courseList, loading} = useCourses();
  const [myCourses, setMyCourses] = useState([])
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
    
  
  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setSearchTerm(searchTerm);
    
    try {
      // Search within myCourses, not courseList
      const filteredCourses = myCourses.filter(course => 
        decodeHtmlEntities(course.title)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filteredCourses);
      setIsSearching(false);
      
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };
    

  const refreshEnrolled = () => {
    const ids = getMyCourses();
    const fullCourses = courseList.filter(course => ids.includes(course.ID));
    setMyCourses(fullCourses);
  }
  
  useEffect(()=>{
    refreshEnrolled();
  }, [courseList, loading])

  if (loading){
    return(
      <NavBar onSearch={handleSearch} />
    )
  }

  // Should be myCourses, not courseList
  const coursesToDisplay = searchTerm ? searchResults : myCourses;
  
  return(
    <>
      <NavBar onSearch={handleSearch} />
      {myCourses.length != 0 ? (
        <section className={styles['main-section']}>
          {coursesToDisplay.length > 0 ? (
            coursesToDisplay.map((course) => {
              return (
                <Course key={course.ID} course={course} ind={coursesToDisplay.indexOf(course)} />
              );
            })
          ) : searchTerm ? (
            <div className={styles["no-results"]}>
              <p>No courses found matching "{searchTerm}"</p>
            </div>
          ) : null}
        </section>
      ) : (
        <section className={styles.section2}>
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: 200, marginBottom: '-2rem'}}
          />
          <div className={styles.no}>You have no courses!</div>
          <Link to={"/mainpg"} className={styles.return}>
            Return to dashboard{" "}
          </Link>
        </section>
      )}
    </>
  )
}

export default MyCourses;
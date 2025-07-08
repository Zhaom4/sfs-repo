import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import Course from "../../components/Course";
import { useCourses } from "../../contexts/CourseContext";
import Loader from "../../components/Loader";
import clsx from "clsx";
// import { fetchCourseDetails } from "../../services/wordpressapi";
import { fetchCourseLessons } from "../../services/wordpressapi";
import { decodeHtmlEntities } from "../../services/helpers";

function MainPage() {
  const { courseList, loading } = useCourses();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseDetails, setCourseDetails] = useState({})
  

  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setSearchTerm(searchTerm);
    
    try {
      const filteredCourses = courseList.filter(course => 
        decodeHtmlEntities(course.title)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
        setSearchResults(filteredCourses);
        setIsSearching(false);
      
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };
  
  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  useEffect(()=>{
    const getCourseDetails = async () => {
      const details = {}
      for (const course of courseList){
        const response = await fetchCourseLessons(course.ID)
        details[course.ID] = response
      }
      setCourseDetails(details) 
    }
    getCourseDetails();
  }, [])

  useEffect(() => {
    if (!loading) {
      setFadeOut(true);

      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }
  }, [loading]);

  useEffect(() => {
  console.log('Updated courseDetails:', courseDetails);
}, [courseDetails]);

  if (showLoader) {
    return (
      <div className={clsx(
        styles['loader-container'], 
        fadeOut && styles['fade']
      )}>
        <Loader />
      </div>
    );
  }

  // Determine which courses to display
  const coursesToDisplay = searchTerm ? searchResults : courseList;

  return (
    <>
      <NavBar onSearch={handleSearch} />
      <Sidebar />
      <div className={styles["container"]}>
        <section className={styles["main-section"]}>
          {isSearching ? (
            <div className={styles["search-loading"]}>
            </div>
          ) : (
            <>
              {coursesToDisplay.length > 0 ? (
                coursesToDisplay.map((course) => {
                  console.log(courseDetails)
                  return (
                    <Course key={course.ID} course={course} ind={coursesToDisplay.indexOf(course)} />
                  );
                })
              ) : searchTerm ? (
                <div className={styles["no-results"]}>
                  <p>No courses found matching "{searchTerm}"</p>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default MainPage;
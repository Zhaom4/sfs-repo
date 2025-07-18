import styles from '../customer/Favorites.module.css'
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import Course from '../../components/Course';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from '../../assets/sad-face.json';
import {gsap} from 'gsap';
import { useCourses } from '../../contexts/CourseContext';
import { useUserContext } from '../../hooks/useUserContext';
import { decodeHtmlEntities } from '../../services/helpers';

function MyCourses(){
  const { courseList, loading: coursesLoading } = useCourses();
  const {
    user,
    enrolledCourses,
    favoritedCourses,
    loading: userLoading,
    error,
    unenrollFromCourse,
    addCourseToFavorites,
    removeCourseFromFavorites,
    isEnrolledInCourse,
    isCourseFavorited,
    getCourseProgress,
    updateCourseProgress,
    clearError
  } = useUserContext();
  
  const [myCourses, setMyCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log(enrolledCourses)
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);
    
  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setSearchTerm(searchTerm);
    
    try {
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

  // Handle course unenrollment
  const handleUnenrollment = async (courseId) => {
    try {
      const success = await unenrollFromCourse(courseId);
      if (!success) {
        console.error('Failed to unenroll from course');
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };

  // Handle course favorites
  const handleFavorite = async (courseId) => {
    try {
      if (isCourseFavorited(courseId)) {
        const success = await removeCourseFromFavorites(courseId);
        if (!success) {
          console.error('Failed to remove course from favorites');
        }
      } else {
        const success = await addCourseToFavorites(courseId);
        if (!success) {
          console.error('Failed to add course to favorites');
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  // Handle course progress update
  const handleProgressUpdate = async (courseId, progress) => {
    try {
      const success = await updateCourseProgress(courseId, progress);
      if (!success) {
        console.error('Failed to update course progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Get enrolled courses with full course data
  const getEnrolledCoursesWithData = () => {
    if (!enrolledCourses || !courseList) return [];
    
    return enrolledCourses.map(enrolledCourse => {
      const fullCourse = courseList.find(course => course.ID === enrolledCourse.course_id);
      return fullCourse ? {
        ...fullCourse,
        enrollmentData: enrolledCourse,
        progress: enrolledCourse.progress,
        enrolledAt: enrolledCourse.enrolled_at,
        isEnrolled: true,
        isFavorited: isCourseFavorited(enrolledCourse.course_id),
        userActions: {
          onUnenroll: () => handleUnenrollment(enrolledCourse.course_id),
          onFavorite: () => handleFavorite(enrolledCourse.course_id),
          onProgressUpdate: (progress) => handleProgressUpdate(enrolledCourse.course_id, progress)
        }
      } : null;
    }).filter(Boolean);
  };

  // Update myCourses when enrolledCourses or courseList changes
  useEffect(() => {
    if (enrolledCourses && courseList) {
      const coursesWithData = getEnrolledCoursesWithData();
      setMyCourses(coursesWithData);
    }
  }, [enrolledCourses, courseList]);

  // Clear any errors
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  // Show loading state
  if (coursesLoading || userLoading) {
    return (
      <div>
        <NavBar onSearch={handleSearch} />
        <div className={styles['loading-container']}>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const coursesToDisplay = searchTerm ? searchResults : myCourses;
  
  return (
    <>
      <NavBar onSearch={handleSearch} />
      
      {/* Display error message if there's an error */}
      {error && (
        <div className={styles["error-message"]}>
          <p>Error: {error}</p>
          <button onClick={clearError} className={styles["clear-error-btn"]}>
            Dismiss
          </button>
        </div>
      )}
      
      {myCourses.length > 0 ? (
        <section className={styles['main-section']}>
          <div className={styles['header']}>
            <h2>My Enrolled Courses ({myCourses.length})</h2>
          </div>
          
          {isSearching ? (
            <div className={styles["search-loading"]}>
              <p>Searching...</p>
            </div>
          ) : (
            <>
              {coursesToDisplay.length > 0 ? (
                coursesToDisplay.map((course) => {
                  return (
                    <Course 
                      key={course.ID} 
                      course={course} 
                      showProgress={true}
                      isAuthenticated={true}
                    />
                  );
                })
              ) : searchTerm ? (
                <div className={styles["no-results"]}>
                  <p>No courses found matching "{searchTerm}"</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className={styles["clear-search-btn"]}
                  >
                    Clear Search
                  </button>
                </div>
              ) : null}
            </>
          )}
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
            Return to dashboard
          </Link>
        </section>
      )}
    </>
  );
}

export default MyCourses;
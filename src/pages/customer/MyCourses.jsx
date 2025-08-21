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
    console.log('📊 Enrolled courses data:', enrolledCourses);
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);
    
  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setSearchTerm(searchTerm);
    
    try {
      const filteredCourses = myCourses.filter(course => 
        decodeHtmlEntities(course.post_title)?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Get enrolled courses with full course data - FIXED
  const getEnrolledCoursesWithData = () => {
    if (!enrolledCourses || !courseList) {
      console.log('❌ Missing data:', { 
        enrolledCourses: !!enrolledCourses, 
        courseList: !!courseList 
      });
      return [];
    }
    
    console.log('🔍 Debugging enrollment data:');
    console.log('📝 Enrolled courses:', enrolledCourses.map(c => ({ 
      id: c.course_id, 
      type: typeof c.course_id,
      progress: c.progress 
    })));
    console.log('📚 Course list sample:', courseList.slice(0, 3).map(c => ({ 
      id: c.ID, 
      type: typeof c.ID,
      title: c.post_title 
    })));
    
    const coursesWithData = enrolledCourses.map(enrolledCourse => {
      // FIXED: Convert both to strings for comparison
      const fullCourse = courseList.find(course => 
        String(course.ID) === String(enrolledCourse.course_id)
      );
      
      if (!fullCourse) {
        console.log(`❌ No course found for ID: ${enrolledCourse.course_id} (${typeof enrolledCourse.course_id})`);
        return null;
      }
      
      console.log(`✅ Found course: ${fullCourse.post_title} (ID: ${fullCourse.ID})`);
      
      return {
        ...fullCourse,
        enrollmentData: enrolledCourse,
        progress: enrolledCourse.progress || 0,
        enrolledAt: enrolledCourse.enrolled_at,
        isEnrolled: true,
        isFavorited: isCourseFavorited(enrolledCourse.course_id),
        userActions: {
          onUnenroll: () => handleUnenrollment(enrolledCourse.course_id),
          onFavorite: () => handleFavorite(enrolledCourse.course_id),
          onProgressUpdate: (progress) => handleProgressUpdate(enrolledCourse.course_id, progress)
        }
      };
    }).filter(Boolean);
    
    console.log('🎯 Final courses with data:', coursesWithData.length);
    return coursesWithData;
  };

  // Update myCourses when enrolledCourses or courseList changes
  useEffect(() => {
    console.log('🔄 Updating myCourses...');
    if (enrolledCourses && courseList) {
      const coursesWithData = getEnrolledCoursesWithData();
      setMyCourses(coursesWithData);
      console.log('✅ Set myCourses:', coursesWithData.length);
    } else {
      console.log('⏳ Waiting for data...', { 
        hasEnrolledCourses: !!enrolledCourses, 
        hasCourseList: !!courseList 
      });
      setMyCourses([]);
    }
  }, [enrolledCourses, courseList, favoritedCourses]); // Added favoritedCourses dependency

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
  
  console.log('🎬 Rendering MyCourses:', {
    enrolledCoursesCount: enrolledCourses?.length || 0,
    myCoursesCount: myCourses.length,
    coursesToDisplayCount: coursesToDisplay.length,
    searchTerm
  });
  
  return (
    <>
      <NavBar onSearch={handleSearch} />

      {/* Display error message if there's an error */}
      {error && (
        <div className={styles["error-message"]}>
          <p>⚠️ {error}</p>
          <button onClick={clearError} className={styles["clear-error-btn"]}>
            ✕ Dismiss
          </button>
        </div>
      )}

     
      
      {myCourses.length > 0 ? (
        <section className={styles['main-section']}>
          {/* <div className={styles['header']}>
            <h2>My Enrolled Courses ({myCourses.length})</h2>
          </div>
           */}
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
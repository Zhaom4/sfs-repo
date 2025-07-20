import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import Course from "../../components/Course";
import { useCourses } from "../../contexts/CourseContext";
import Loader from "../../components/Loader";
import clsx from "clsx";
import { decodeHtmlEntities } from "../../services/helpers";
import { fetchSingleCourse } from "../../services/wordpressapi";
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';
import WordPressSupabaseDebugger from "../../debug/WordPressSupabaseDebugger";
import SimpleDatabaseTest from "../../debug/SimpleDatabaseTest";


function MainPage() {
  const { courseList, loading } = useCourses();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const {
    user,
    userProfile,
    enrolledCourses,
    favoritedCourses,
    loading: userLoading,
    error,
    enrollInCourse,
    unenrollFromCourse,
    addCourseToFavorites,
    removeCourseFromFavorites,
    isEnrolledInCourse,
    isCourseFavorited,
    getCourseProgress,
    updateCourseProgress,
    clearError
  } = useUserContext();

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

  // Handle course enrollment
  const handleEnrollment = async (courseId) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      if (isEnrolledInCourse(courseId)) {
        const success = await unenrollFromCourse(courseId);
        if (!success) {
          console.error('Failed to unenroll from course');
        }
      } else {
        const success = await enrollInCourse(courseId);
        if (!success) {
          console.error('Failed to enroll in course');
        }
      }
    } catch (error) {
      console.error('Error handling enrollment:', error);
    }
  };

  // Handle course favorites
  const handleFavorite = async (courseId) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

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
    if (!user) return;

    try {
      const success = await updateCourseProgress(courseId, progress);
      if (!success) {
        console.error('Failed to update course progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Clear any errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  useEffect(() => {
    // Debug logging to see what's happening
    console.log('Loading states:', { loading, userLoading });
    
    if (!loading) {
      setFadeOut(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }
  }, [loading, userLoading]);
  
  useEffect(() => {
    const getCourseDetails = async(courseId) => {
      const response = await fetchSingleCourse(courseId);
      console.log(response);
    };  
    
    // Only run when we actually have data
    if (courseList && courseList.length > 0) {
      getCourseDetails(courseList[0].ID);
    }
  }, [courseList]);

  // Show loader while courses or user data is loading
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

  // Enhance courses with user-specific data
  const enhancedCourses = coursesToDisplay.map(course => ({
    ...course,
    isEnrolled: user ? isEnrolledInCourse(course.ID) : false,
    isFavorited: user ? isCourseFavorited(course.ID) : false,
    progress: user ? getCourseProgress(course.ID) : 0,
    userActions: {
      onEnroll: () => handleEnrollment(course.ID),
      onFavorite: () => handleFavorite(course.ID),
      onProgressUpdate: (progress) => handleProgressUpdate(course.ID, progress)
    }
  }));

  return (
    <>
    {/* {process.env.NODE_ENV === 'development' && <SimpleDatabaseTest />} */}
    {/* {process.env.NODE_ENV === 'development' && <WordPressSupabaseDebugger />} */}

      <NavBar onSearch={handleSearch} />
      <Sidebar />
      <div className={styles["container"]}>
        <section className={styles["main-section"]}>
          {/* Display error message if there's an error */}
          {error && (
            <div className={styles["error-message"]}>
              <p>Error: {error}</p>
              <button onClick={clearError} className={styles["clear-error-btn"]}>
                Dismiss
              </button>
            </div>
          )}
          
          {/* Display user greeting if logged in */}
          {user && userProfile && (
            <div className={styles["user-greeting"]}>
              <h2>Welcome back, {userProfile.display_name || userProfile.email}!</h2>
              <p>You're enrolled in {enrolledCourses.length} courses and have {favoritedCourses.length} favorites.</p>
            </div>
          )}
          
          {isSearching ? (
            <div className={styles["search-loading"]}>
              <Loader />
            </div>
          ) : (
            <>
              {enhancedCourses.length > 0 ? (
                enhancedCourses.map((course) => {
                  return (
                    <Course 
                      key={course.ID} 
                      course={course} 
                      ind={enhancedCourses.indexOf(course)}
                      isAuthenticated={!!user}
                    />
                  );
                })
              ) : searchTerm ? (
                <div className={styles["no-results"]}>
                  <p>No courses found matching "{searchTerm}"</p>
                  <button onClick={clearSearch} className={styles["clear-search-btn"]}>
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className={styles["no-courses"]}>
                  <p>No courses available at the moment.</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default MainPage;
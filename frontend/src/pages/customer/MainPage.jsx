// Updated MainPage.jsx with sign-in only modal logic

import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import Course from "../../components/Course";
import { useCourses } from "../../contexts/CourseContext";
import Loader from "../../components/Loader";
import clsx from "clsx";
import { decodeHtmlEntities } from "../../services/helpers";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';
import WelcomeModal from "../../components/WelcomeModal";

function MainPage() {
  const { courseList, loading } = useCourses();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();
  
  // Track if we've already shown the modal for this session
  const hasShownModalThisSession = useRef(false);
  const lastUserId = useRef(null);
  
  const {
    user,
    userProfile,
    enrolledCourses,
    favoritedCourses,
    loading: userLoading,
    error,
    clearError
  } = useUserContext();

  // Show welcome modal ONLY on fresh sign-in
  useEffect(() => {
    // Only proceed if we have user data and it's not loading
    if (!user || !userProfile || userLoading) {
      return;
    }

    // Check if this is a new user sign-in (different from last user)
    const isNewSignIn = lastUserId.current !== user.id;
    
    // Update the last user ID
    lastUserId.current = user.id;

    if (isNewSignIn && !hasShownModalThisSession.current) {
      const hideWelcome = localStorage.getItem('hideWelcomeModal');
      
      if (!hideWelcome) {
        console.log('🎉 Showing welcome modal for fresh sign-in');
        
        // Mark that we've shown the modal this session
        hasShownModalThisSession.current = true;
        
        // Add a small delay for better UX
        const timer = setTimeout(() => {
          setShowWelcomeModal(true);
        }, 800);
        
        return () => clearTimeout(timer);
      } else {
        hasShownModalThisSession.current = true;
      }
    } else if (!isNewSignIn) {
      console.log('🔄 Same user - not showing welcome modal (page reload)');
    }
  }, [user, userProfile, userLoading]);

  // Reset session tracking when user logs out
  useEffect(() => {
    if (!user) {
      console.log('👋 User logged out - resetting session tracking');
      hasShownModalThisSession.current = false;
      lastUserId.current = null;
      setShowWelcomeModal(false);
    }
  }, [user]);

  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setSearchTerm(searchTerm);
    
    try {
      const filteredCourses = courseList.filter(course => 
        decodeHtmlEntities(course.post_title)?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  // Manual trigger for welcome modal (from mini banner)
  const handleShowWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  // Clear any errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (!loading) {
      setFadeOut(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }
  }, [loading]);

  // Show loader while courses are loading
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

  const coursesToDisplay = searchTerm ? searchResults : courseList;

  return (
    <>
      <NavBar onSearch={handleSearch} />
      <Sidebar />
      
      {/* Welcome Modal - Only shows on fresh sign-in */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
        userProfile={userProfile}
        enrolledCount={enrolledCourses?.length || 0}
        favoritesCount={favoritedCourses?.length || 0}
      />
      
      <div className={styles["container"]}>
        <section className={styles["main-section"]}>
          {/* Display error message if there's an error */}
          {error && (
            <div className={styles["error-message"]}>
              <p>⚠️ {error}</p>
              <button onClick={clearError} className={styles["clear-error-btn"]}>
                ✕ Dismiss
              </button>
            </div>
          )}
          
          
          {isSearching ? (
            <div className={styles["search-loading"]}>
              <Loader />
            </div>
          ) : (
            <>
              {coursesToDisplay && coursesToDisplay.length > 0 ? (
                coursesToDisplay.map((course) => {
                  return (
                    <Course 
                      key={course.ID} 
                      course={course}
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
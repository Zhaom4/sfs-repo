import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserDataService } from '../services/userData';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [favoritedCourses, setFavoritedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to normalize course ID (WordPress courses use numeric IDs)
  const normalizeCourseId = (courseId) => {
    return String(courseId);
  };

  // Initialize user data
  useEffect(() => {
    let mounted = true;

    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          return;
        }

        if (session?.user && mounted) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else {
          // No user session
          setUser(null);
          setUserProfile(null);
          setEnrolledCourses([]);
          setFavoritedCourses([]);
        }
      } catch (err) {
        console.error('Error initializing user:', err);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        setUser(session.user);
        setLoading(true);
        await loadUserData(session.user.id);
        setLoading(false);
      } else if (event === 'SIGNED_OUT' && mounted) {
        setUser(null);
        setUserProfile(null);
        setEnrolledCourses([]);
        setFavoritedCourses([]);
        setError(null);
      }
    });

    initializeUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load user data from database
  const loadUserData = async (userId) => {
    try {
      console.log('Loading user data for:', userId);
      
      const [profile, dashboardData] = await Promise.all([
        UserDataService.getUserProfile(userId),
        UserDataService.getUserDashboardData(userId)
      ]);

      console.log('Loaded data:', { profile, dashboardData });

      setUserProfile(profile);
      setEnrolledCourses(dashboardData.enrolledCourses || []);
      setFavoritedCourses(dashboardData.favoritedCourses || []);
      setError(null);

      // Debug: Log course IDs to see the format
      console.log('=== USER DATA LOADED ===');
      console.log('Enrolled courses:', dashboardData.enrolledCourses?.map(c => `ID: ${c.course_id} (${typeof c.course_id})`));
      console.log('Favorited courses:', dashboardData.favoritedCourses?.map(c => `ID: ${c.course_id} (${typeof c.course_id})`));
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.id);
    }
  };

  // Course enrollment functions
  const enrollInCourse = async (courseId) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      console.log('UserContext: Enrolling in course:', courseId, typeof courseId);
      
      const result = await UserDataService.enrollUserInCourse(user.id, courseId);
      
      if (result) {
        // Update local state immediately
        const newEnrollment = {
          course_id: normalizeCourseId(courseId),
          user_id: user.id,
          progress: 0,
          enrolled_at: new Date().toISOString()
        };
        
        setEnrolledCourses(prev => {
          // Check if already exists to avoid duplicates
          const exists = prev.some(course => 
            String(course.course_id) === String(courseId)
          );
          
          if (exists) {
            return prev;
          }
          
          return [...prev, newEnrollment];
        });
        
        console.log('UserContext: Successfully enrolled in course');
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('UserContext: Error enrolling in course:', err);
      setError(err.message);
      return false;
    }
  };

  const unenrollFromCourse = async (courseId) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      console.log('UserContext: Unenrolling from course:', courseId, typeof courseId);
      
      const success = await UserDataService.unenrollUserFromCourse(user.id, courseId);
      
      if (success) {
        // Update local state immediately
        setEnrolledCourses(prev => prev.filter(course => 
          String(course.course_id) !== String(courseId)
        ));
        
        console.log('UserContext: Successfully unenrolled from course');
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('UserContext: Error unenrolling from course:', err);
      setError(err.message);
      return false;
    }
  };

  // Course favorites functions
  const addCourseToFavorites = async (courseId) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      console.log('UserContext: Adding course to favorites:', courseId, typeof courseId);
      
      const result = await UserDataService.addCourseToFavorites(user.id, courseId);
      
      if (result) {
        // Update local state immediately
        const newFavorite = {
          course_id: normalizeCourseId(courseId),
          user_id: user.id,
          favorited_at: new Date().toISOString()
        };
        
        setFavoritedCourses(prev => {
          // Check if already exists to avoid duplicates
          const exists = prev.some(course => 
            String(course.course_id) === String(courseId)
          );
          
          if (exists) {
            return prev;
          }
          
          return [...prev, newFavorite];
        });
        
        console.log('UserContext: Successfully added course to favorites');
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('UserContext: Error adding course to favorites:', err);
      setError(err.message);
      return false;
    }
  };

  const removeCourseFromFavorites = async (courseId) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      console.log('UserContext: Removing course from favorites:', courseId, typeof courseId);
      
      const success = await UserDataService.removeCourseFromFavorites(user.id, courseId);
      
      if (success) {
        // Update local state immediately
        setFavoritedCourses(prev => prev.filter(course => 
          String(course.course_id) !== String(courseId)
        ));
        
        console.log('UserContext: Successfully removed course from favorites');
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('UserContext: Error removing course from favorites:', err);
      setError(err.message);
      return false;
    }
  };

  // Progress functions
  const updateCourseProgress = async (courseId, progress) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const result = await UserDataService.updateCourseProgress(user.id, courseId, progress);
      
      if (result) {
        // Update local state
        setEnrolledCourses(prev => prev.map(course => 
          String(course.course_id) === String(courseId) 
            ? { ...course, progress }
            : course
        ));
        
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('UserContext: Error updating course progress:', err);
      setError(err.message);
      return false;
    }
  };

  // Helper functions - FIXED for WordPress course IDs
  const isEnrolledInCourse = (courseId) => {
    const normalizedId = String(courseId);
    const isEnrolled = enrolledCourses.some(course => 
      String(course.course_id) === normalizedId
    );
    
    console.log(`UserContext: Checking enrollment for course ${normalizedId}:`, isEnrolled);
    console.log('UserContext: Available enrolled courses:', enrolledCourses.map(c => String(c.course_id)));
    
    return isEnrolled;
  };

  const isCourseFavorited = (courseId) => {
    const normalizedId = String(courseId);
    const isFavorited = favoritedCourses.some(course => 
      String(course.course_id) === normalizedId
    );
    
    console.log(`UserContext: Checking favorite for course ${normalizedId}:`, isFavorited);
    console.log('UserContext: Available favorited courses:', favoritedCourses.map(c => String(c.course_id)));
    
    return isFavorited;
  };

  const getCourseProgress = (courseId) => {
    const course = enrolledCourses.find(course => 
      String(course.course_id) === String(courseId)
    );
    return course?.progress || 0;
  };

  const clearError = () => {
    setError(null);
  };

  // Debug function
  const debugUserData = () => {
    console.log('=== USER CONTEXT DEBUG ===');
    console.log('User:', user?.id);
    console.log('User Profile:', userProfile);
    console.log('Enrolled Courses:', enrolledCourses);
    console.log('Favorited Courses:', favoritedCourses);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('=========================');
  };

  const contextValue = {
    // User state
    user,
    userProfile,
    enrolledCourses,
    favoritedCourses,
    loading,
    error,

    // Actions
    enrollInCourse,
    unenrollFromCourse,
    addCourseToFavorites,
    removeCourseFromFavorites,
    updateCourseProgress,
    refreshUserData,

    // Helper functions
    isEnrolledInCourse,
    isCourseFavorited,
    getCourseProgress,
    clearError,
    debugUserData, // Add debug function
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
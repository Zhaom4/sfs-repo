// Updated api.js - Now works with Supabase backend instead of localStorage
// These functions are now wrapper functions that work with the UserContext

import { UserDataService } from './userData';

// Get current user from context or session
const getCurrentUser = async () => {
  const { supabase } = await import('../lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// FAVORITES FUNCTIONS
export async function addToFavorites(courseId) {
  const user = await getCurrentUser();
  if (!user) {
    console.warn('User not authenticated');
    return false;
  }
  
  try {
    await UserDataService.addCourseToFavorites(user.id, courseId);
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
}

export async function removeFromFavorites(courseId) {
  const user = await getCurrentUser();
  if (!user) {
    console.warn('User not authenticated');
    return false;
  }
  
  try {
    await UserDataService.removeCourseFromFavorites(user.id, courseId);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
}

export async function isFavorited(courseId) {
  const user = await getCurrentUser();
  if (!user) return false;
  
  try {
    const favorites = await UserDataService.getUserFavoritedCourses(user.id);
    return favorites.some(fav => fav.course_id === courseId);
  } catch (error) {
    console.error('Error checking if favorited:', error);
    return false;
  }
}

export async function getFavorites() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  try {
    const favorites = await UserDataService.getUserFavoritedCourses(user.id);
    return favorites.map(fav => fav.course_id);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

// ENROLLMENT FUNCTIONS
export async function addToMyCourses(courseId) {
  const user = await getCurrentUser();
  if (!user) {
    console.warn('User not authenticated');
    return false;
  }
  
  try {
    await UserDataService.enrollUserInCourse(user.id, courseId);
    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
}

export async function removeFromEnrolled(courseId) {
  const user = await getCurrentUser();
  if (!user) {
    console.warn('User not authenticated');
    return false;
  }
  
  try {
    await UserDataService.unenrollUserFromCourse(user.id, courseId);
    return true;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return false;
  }
}

export async function isEnrolled(courseId) {
  const user = await getCurrentUser();
  if (!user) return false;
  
  try {
    const enrolled = await UserDataService.getUserEnrolledCourses(user.id);
    return enrolled.some(course => course.course_id === courseId);
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
}

export async function getMyCourses() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  try {
    const enrolled = await UserDataService.getUserEnrolledCourses(user.id);
    return enrolled.map(course => course.course_id);
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    return [];
  }
}

// PROGRESS FUNCTIONS
export async function updateCourseProgress(courseId, progress) {
  const user = await getCurrentUser();
  if (!user) {
    console.warn('User not authenticated');
    return false;
  }
  
  try {
    await UserDataService.updateCourseProgress(user.id, courseId, progress);
    return true;
  } catch (error) {
    console.error('Error updating course progress:', error);
    return false;
  }
}

export async function getCourseProgress(courseId) {
  const user = await getCurrentUser();
  if (!user) return 0;
  
  try {
    const enrolled = await UserDataService.getUserEnrolledCourses(user.id);
    const course = enrolled.find(c => c.course_id === courseId);
    return course ? course.progress : 0;
  } catch (error) {
    console.error('Error getting course progress:', error);
    return 0;
  }
}

// LEGACY FUNCTIONS (for backward compatibility)
// These are synchronous versions that fall back to localStorage
// Use these only if you need immediate synchronous access

export function addToFavoritesSync(courseId) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favorites.includes(courseId)) {
    favorites.push(courseId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function removeFromFavoritesSync(courseId) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || '[]');
  const ind = favorites.findIndex(id => id === courseId);
  if (ind > -1) {
    favorites.splice(ind, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function isFavoritedSync(courseId) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || '[]');
  return favorites.includes(courseId);
}

export function getFavoritesSync() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

export function addToMyCoursesSync(courseId) {
  let myCourses = JSON.parse(localStorage.getItem('my-courses') || '[]');
  if (!myCourses.includes(courseId)) {
    myCourses.push(courseId);
    localStorage.setItem('my-courses', JSON.stringify(myCourses));
  }
}

export function removeFromEnrolledSync(courseId) {
  let enrolled = JSON.parse(localStorage.getItem("my-courses") || '[]');
  const ind = enrolled.findIndex(id => id === courseId);
  if (ind > -1) {
    enrolled.splice(ind, 1);
    localStorage.setItem('my-courses', JSON.stringify(enrolled));
  }
}

export function isEnrolledSync(courseId) {
  let myCourses = JSON.parse(localStorage.getItem('my-courses') || '[]');
  return myCourses.includes(courseId);
}

export function getMyCoursesSync() {
  return JSON.parse(localStorage.getItem('my-courses') || '[]');
}
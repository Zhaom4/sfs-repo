// Updated UserDataService to handle WordPress course IDs properly
import { supabase } from '../lib/supabase';

export class UserDataService {
  // Helper function to ensure course_id is stored as string
  static normalizeCourseId(courseId) {
    return String(courseId);
  }

  // Helper function to validate course ID format
  static isValidCourseId(courseId) {
    return courseId && (typeof courseId === 'string' || typeof courseId === 'number');
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      console.log('Getting user profile for:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      // If no profile exists, create one
      if (!data) {
        console.log('No profile found, creating new one...');
        const { data: { user } } = await supabase.auth.getUser();
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: user?.email,
            full_name: user?.user_metadata?.full_name || user?.email,
            display_name: user?.user_metadata?.full_name || user?.email?.split('@')[0]
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
          throw insertError;
        }
        console.log('Created new profile:', newProfile);
        return newProfile;
      }
      
      console.log('Found existing profile:', data);
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  // Get user's enrolled courses
  static async getUserEnrolledCourses(userId) {
    try {
      console.log('Getting enrolled courses for user:', userId);
      
      const { data, error } = await supabase
        .from('user_enrolled_courses')
        .select('*')
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching enrolled courses:', error);
        throw error;
      }
      
      console.log('Found enrolled courses:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getUserEnrolledCourses:', error);
      throw error;
    }
  }

  // Enroll user in a course - FIXED for WordPress course IDs
  static async enrollUserInCourse(userId, courseId) {
    try {
      console.log('Enrolling user in course:', { userId, courseId, courseIdType: typeof courseId });
      
      if (!this.isValidCourseId(courseId)) {
        throw new Error('Invalid course ID provided');
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      console.log('Normalized course ID:', normalizedCourseId);
      
      // Check if already enrolled first
      const { data: existing, error: checkError } = await supabase
        .from('user_enrolled_courses')
        .select('id, course_id')
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing enrollment:', checkError);
        throw checkError;
      }
      
      if (existing) {
        console.log('User already enrolled in course:', existing);
        return existing; // Return the existing enrollment instead of throwing error
      }

      // Insert new enrollment
      const enrollmentData = {
        user_id: userId,
        course_id: normalizedCourseId,
        progress: 0,
        enrolled_at: new Date().toISOString()
      };

      console.log('Inserting enrollment data:', enrollmentData);

      const { data, error } = await supabase
        .from('user_enrolled_courses')
        .insert(enrollmentData)
        .select()
        .single();
      
      if (error) {
        console.error('Error enrolling in course:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Check for common error codes
        if (error.code === '23505') { // Unique constraint violation
          console.log('User might already be enrolled, checking again...');
          return await this.getUserEnrolledCourses(userId).then(courses => 
            courses.find(c => c.course_id === normalizedCourseId)
          );
        }
        
        throw error;
      }
      
      console.log('Successfully enrolled:', data);
      return data;
    } catch (error) {
      console.error('Error in enrollUserInCourse:', error);
      throw error;
    }
  }

  // Unenroll user from a course - FIXED for WordPress course IDs
  static async unenrollUserFromCourse(userId, courseId) {
    try {
      console.log('Unenrolling user from course:', { userId, courseId });
      
      if (!this.isValidCourseId(courseId)) {
        throw new Error('Invalid course ID provided');
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      
      const { error, count } = await supabase
        .from('user_enrolled_courses')
        .delete({ count: 'exact' })
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId);
      
      if (error) {
        console.error('Error unenrolling from course:', error);
        throw error;
      }
      
      console.log('Successfully unenrolled from course, rows affected:', count);
      return true;
    } catch (error) {
      console.error('Error in unenrollUserFromCourse:', error);
      throw error;
    }
  }

  // Get user's favorited courses
  static async getUserFavoritedCourses(userId) {
    try {
      console.log('Getting favorited courses for user:', userId);
      
      const { data, error } = await supabase
        .from('user_favorited_courses')
        .select('*')
        .eq('user_id', userId)
        .order('favorited_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching favorited courses:', error);
        throw error;
      }
      
      console.log('Found favorited courses:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getUserFavoritedCourses:', error);
      throw error;
    }
  }

  // Add course to favorites - FIXED for WordPress course IDs
  static async addCourseToFavorites(userId, courseId) {
    try {
      console.log('Adding course to favorites:', { userId, courseId, courseIdType: typeof courseId });
      
      if (!this.isValidCourseId(courseId)) {
        throw new Error('Invalid course ID provided');
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      console.log('Normalized course ID:', normalizedCourseId);
      
      // Check if already favorited
      const { data: existing, error: checkError } = await supabase
        .from('user_favorited_courses')
        .select('id, course_id')
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing favorite:', checkError);
        throw checkError;
      }
      
      if (existing) {
        console.log('Course already favorited:', existing);
        return existing; // Return existing instead of throwing error
      }

      // Insert new favorite
      const favoriteData = {
        user_id: userId,
        course_id: normalizedCourseId,
        favorited_at: new Date().toISOString()
      };

      console.log('Inserting favorite data:', favoriteData);

      const { data, error } = await supabase
        .from('user_favorited_courses')
        .insert(favoriteData)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding course to favorites:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Check for common error codes
        if (error.code === '23505') { // Unique constraint violation
          console.log('Course might already be favorited, checking again...');
          return await this.getUserFavoritedCourses(userId).then(courses => 
            courses.find(c => c.course_id === normalizedCourseId)
          );
        }
        
        throw error;
      }
      
      console.log('Successfully added to favorites:', data);
      return data;
    } catch (error) {
      console.error('Error in addCourseToFavorites:', error);
      throw error;
    }
  }

  // Remove course from favorites - FIXED for WordPress course IDs
  static async removeCourseFromFavorites(userId, courseId) {
    try {
      console.log('Removing course from favorites:', { userId, courseId });
      
      if (!this.isValidCourseId(courseId)) {
        throw new Error('Invalid course ID provided');
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      
      const { error, count } = await supabase
        .from('user_favorited_courses')
        .delete({ count: 'exact' })
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId);
      
      if (error) {
        console.error('Error removing course from favorites:', error);
        throw error;
      }
      
      console.log('Successfully removed from favorites, rows affected:', count);
      return true;
    } catch (error) {
      console.error('Error in removeCourseFromFavorites:', error);
      throw error;
    }
  }

  // Update course progress - FIXED for WordPress course IDs
  static async updateCourseProgress(userId, courseId, progress) {
    try {
      console.log('Updating course progress:', { userId, courseId, progress });
      
      if (!this.isValidCourseId(courseId)) {
        throw new Error('Invalid course ID provided');
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      
      // Ensure progress is between 0 and 100
      const normalizedProgress = Math.max(0, Math.min(100, progress));
      
      const { data, error } = await supabase
        .from('user_enrolled_courses')
        .update({ 
          progress: normalizedProgress,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating course progress:', error);
        throw error;
      }
      
      console.log('Updated progress:', data);
      return data;
    } catch (error) {
      console.error('Error in updateCourseProgress:', error);
      throw error;
    }
  }

  // Check if user is enrolled in a course - FIXED for WordPress course IDs
  static async isUserEnrolledInCourse(userId, courseId) {
    try {
      if (!this.isValidCourseId(courseId)) {
        return false;
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      
      const { data, error } = await supabase
        .from('user_enrolled_courses')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking enrollment:', error);
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in isUserEnrolledInCourse:', error);
      return false;
    }
  }

  // Check if user has favorited a course - FIXED for WordPress course IDs
  static async isCourseFavorited(userId, courseId) {
    try {
      if (!this.isValidCourseId(courseId)) {
        return false;
      }

      const normalizedCourseId = this.normalizeCourseId(courseId);
      
      const { data, error } = await supabase
        .from('user_favorited_courses')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', normalizedCourseId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite status:', error);
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in isCourseFavorited:', error);
      return false;
    }
  }

  // Get user's dashboard data (enrolled + favorited courses)
  static async getUserDashboardData(userId) {
    try {
      console.log('Getting dashboard data for user:', userId);
      
      const [enrolledCourses, favoritedCourses] = await Promise.all([
        this.getUserEnrolledCourses(userId),
        this.getUserFavoritedCourses(userId)
      ]);

      const result = {
        enrolledCourses: enrolledCourses || [],
        favoritedCourses: favoritedCourses || []
      };
      
      console.log('Dashboard data result:', result);
      return result;
    } catch (error) {
      console.error('Error in getUserDashboardData:', error);
      throw error;
    }
  }

  // Debug function to check what course IDs we have
  static async debugCourseIds(userId) {
    try {
      console.log('=== DEBUGGING COURSE IDS ===');
      
      const [enrolled, favorited] = await Promise.all([
        this.getUserEnrolledCourses(userId),
        this.getUserFavoritedCourses(userId)
      ]);

      console.log('Enrolled course IDs:', enrolled.map(c => ({ id: c.course_id, type: typeof c.course_id })));
      console.log('Favorited course IDs:', favorited.map(c => ({ id: c.course_id, type: typeof c.course_id })));
      
      return { enrolled, favorited };
    } catch (error) {
      console.error('Error in debugCourseIds:', error);
      return { enrolled: [], favorited: [] };
    }
  }

  // Test database connection
  static async testConnection() {
    try {
      console.log('Testing database connection...');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
      
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  }
}
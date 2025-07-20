import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserDataService } from '../services/userData';
import { useUserContext } from '../hooks/useUserContext';
import { useCourses } from '../contexts/CourseContext';

const WordPressSupabaseDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, debugUserData, enrolledCourses, favoritedCourses } = useUserContext();
  const { courseList } = useCourses();

  const runComprehensiveDiagnostics = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check WordPress course data format
      if (courseList && courseList.length > 0) {
        const sampleCourse = courseList[0];
        results.wordpressCourseFormat = {
          sampleCourse: {
            ID: sampleCourse.ID,
            idType: typeof sampleCourse.ID,
            title: sampleCourse.post_title,
            structure: Object.keys(sampleCourse)
          },
          totalCourses: courseList.length
        };
      }

      // Test 2: Check current user authentication
      const { data: currentUser, error: userError } = await supabase.auth.getUser();
      results.authentication = {
        success: !userError,
        user: currentUser?.user,
        error: userError
      };

      // Test 3: Check Supabase table structures
      const tables = ['user_profiles', 'user_enrolled_courses', 'user_favorited_courses'];
      results.tables = {};

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          results.tables[table] = {
            exists: !error,
            error: error,
            sampleData: data?.[0] || 'No data'
          };
        } catch (err) {
          results.tables[table] = {
            exists: false,
            error: err.message
          };
        }
      }

      // Test 4: WordPress course ID format in Supabase
      if (user) {
        results.userDataInSupabase = {
          enrolledCourses: enrolledCourses.map(course => ({
            courseId: course.course_id,
            courseIdType: typeof course.course_id,
            progress: course.progress
          })),
          favoritedCourses: favoritedCourses.map(course => ({
            courseId: course.course_id,
            courseIdType: typeof course.course_id,
            favoritedAt: course.favorited_at
          }))
        };

        // Test 5: Test favorite operation with actual WordPress course
        if (courseList && courseList.length > 0) {
          try {
            const testCourse = courseList[0];
            const testCourseId = testCourse.ID;
            
            console.log('Testing with WordPress course:', testCourse.post_title, 'ID:', testCourseId, 'Type:', typeof testCourseId);
            
            // Try to add as favorite
            const addResult = await UserDataService.addCourseToFavorites(user.id, testCourseId);
            
            // Check if it was added
            const favoritedCourses = await UserDataService.getUserFavoritedCourses(user.id);
            const wasAdded = favoritedCourses.some(course => String(course.course_id) === String(testCourseId));
            
            // Clean up by removing
            if (wasAdded) {
              await UserDataService.removeCourseFromFavorites(user.id, testCourseId);
            }
            
            results.wordpressFavoriteTest = {
              success: true,
              testCourseId: testCourseId,
              testCourseIdType: typeof testCourseId,
              addResult: addResult,
              wasFoundInDatabase: wasAdded,
              coursesAfterAdd: favoritedCourses.map(c => ({
                id: c.course_id,
                type: typeof c.course_id
              }))
            };
            
          } catch (err) {
            results.wordpressFavoriteTest = {
              success: false,
              error: err.message,
              stack: err.stack
            };
          }
        }

        // Test 6: Test enrollment operation
        if (courseList && courseList.length > 1) {
          try {
            const testCourse = courseList[1]; // Use second course
            const testCourseId = testCourse.ID;
            
            console.log('Testing enrollment with course:', testCourse.post_title, 'ID:', testCourseId);
            
            // Try to enroll
            const enrollResult = await UserDataService.enrollUserInCourse(user.id, testCourseId);
            
            // Check if it was added
            const enrolledCourses = await UserDataService.getUserEnrolledCourses(user.id);
            const wasEnrolled = enrolledCourses.some(course => String(course.course_id) === String(testCourseId));
            
            // Clean up by unenrolling
            if (wasEnrolled) {
              await UserDataService.unenrollUserFromCourse(user.id, testCourseId);
            }
            
            results.wordpressEnrollmentTest = {
              success: true,
              testCourseId: testCourseId,
              testCourseIdType: typeof testCourseId,
              enrollResult: enrollResult,
              wasFoundInDatabase: wasEnrolled,
              coursesAfterEnroll: enrolledCourses.map(c => ({
                id: c.course_id,
                type: typeof c.course_id
              }))
            };
            
          } catch (err) {
            results.wordpressEnrollmentTest = {
              success: false,
              error: err.message,
              stack: err.stack
            };
          }
        }

        // Test 7: Check RLS policies work
        try {
          // Try to access another user's data (should fail)
          const fakeUserId = '00000000-0000-0000-0000-000000000000';
          const { data: otherUserData, error: rlsError } = await supabase
            .from('user_favorited_courses')
            .select('*')
            .eq('user_id', fakeUserId);

          results.rlsTest = {
            success: true,
            canAccessOtherUserData: !rlsError && otherUserData?.length > 0,
            error: rlsError
          };
        } catch (err) {
          results.rlsTest = {
            success: false,
            error: err.message
          };
        }
      }

      setTestResults(results);
    } catch (error) {
      console.error('Comprehensive diagnostic error:', error);
      setTestResults({ 
        error: error.message,
        stack: error.stack 
      });
    } finally {
      setLoading(false);
    }
  };

  const testSpecificCourse = async (courseId) => {
    if (!user) {
      alert('No user logged in');
      return;
    }

    if (!courseId) {
      alert('Please enter a course ID');
      return;
    }

    try {
      console.log('Testing operations with course ID:', courseId, 'Type:', typeof courseId);
      
      // Test favorite
      console.log('Testing favorite...');
      const favoriteResult = await UserDataService.addCourseToFavorites(user.id, courseId);
      console.log('Favorite result:', favoriteResult);
      
      // Check if it exists
      const favoritedCourses = await UserDataService.getUserFavoritedCourses(user.id);
      const isFavorited = favoritedCourses.some(c => String(c.course_id) === String(courseId));
      console.log('Is favorited:', isFavorited);
      
      // Test enrollment
      console.log('Testing enrollment...');
      const enrollResult = await UserDataService.enrollUserInCourse(user.id, courseId);
      console.log('Enroll result:', enrollResult);
      
      // Check if enrolled
      const enrolledCourses = await UserDataService.getUserEnrolledCourses(user.id);
      const isEnrolled = enrolledCourses.some(c => String(c.course_id) === String(courseId));
      console.log('Is enrolled:', isEnrolled);
      
      // Clean up
      if (isFavorited) {
        await UserDataService.removeCourseFromFavorites(user.id, courseId);
      }
      if (isEnrolled) {
        await UserDataService.unenrollUserFromCourse(user.id, courseId);
      }
      
      alert(`Test completed!\nFavorite: ${isFavorited ? 'Success' : 'Failed'}\nEnroll: ${isEnrolled ? 'Success' : 'Failed'}`);
      
    } catch (error) {
      console.error('Specific course test failed:', error);
      alert(`Test failed: ${error.message}`);
    }
  };

  const [testCourseId, setTestCourseId] = useState('');

  useEffect(() => {
    setDebugInfo({
      user: user?.id,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      courseListLength: courseList?.length || 0,
      enrolledCoursesCount: enrolledCourses?.length || 0,
      favoritedCoursesCount: favoritedCourses?.length || 0
    });
  }, [user, courseList, enrolledCourses, favoritedCourses]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '11px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>WordPress-Supabase Debugger</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runComprehensiveDiagnostics} 
          disabled={loading}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Running Tests...' : 'Run Full Diagnostics'}
        </button>
        
        <button 
          onClick={debugUserData}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: 'pointer'
          }}
        >
          Log User Data
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Test Specific Course ID:
        </label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input 
            type="text"
            value={testCourseId}
            onChange={(e) => setTestCourseId(e.target.value)}
            placeholder="Enter WordPress course ID"
            style={{
              flex: 1,
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '11px'
            }}
          />
          <button 
            onClick={() => testSpecificCourse(testCourseId)}
            style={{
              background: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Test
          </button>
        </div>
        {courseList && courseList.length > 0 && (
          <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
            Sample IDs: {courseList.slice(0, 3).map(c => c.ID).join(', ')}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Quick Info:</h4>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '8px', 
          borderRadius: '4px',
          fontSize: '10px'
        }}>
          <div><strong>User:</strong> {user?.id || 'Not logged in'}</div>
          <div><strong>WordPress Courses:</strong> {courseList?.length || 0}</div>
          <div><strong>Enrolled:</strong> {enrolledCourses?.length || 0}</div>
          <div><strong>Favorited:</strong> {favoritedCourses?.length || 0}</div>
        </div>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 10px 0' }}>Test Results:</h4>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '9px',
            overflow: 'auto',
            maxHeight: '300px',
            margin: 0
          }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WordPressSupabaseDebugger;
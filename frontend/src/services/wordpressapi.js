const API = 'key_6051b3e0b7d6c70792e1bb483f11c626'; 
const secret = 'secret_3fe763b2d240f365d2a5c4d726489e1c15876b8449fe375b3436968b0628a939'

const fetchAllCourses = async () => {
  const APIkey = API;
  const secretKey = secret; // You need to get this from Tutor LMS
  
  // Create Basic Auth credentials (same as Postman's Basic Auth)
  const credentials = btoa(`${APIkey}:${secretKey}`);

  try {
    const response = await fetch('https://wordpress-1494981-5707436.cloudwaysapps.com/wp-json/tutor/v1/courses?per_page=100', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Failed to fetch courses: ${response.status} - ${errorText}`);
    }
    
    const courses = await response.json();
    return courses;
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return null;
  }
};

export const fetchSingleCourse = async(courseId) => {
  const APIkey = API;
  const secretKey = secret; // You need to get this from Tutor LMS
  
  const credentials = btoa(`${APIkey}:${secretKey}`);

  const response = await fetch(`https://wordpress-1494981-5707436.cloudwaysapps.com/wp-json/tutor/v1/courses/${courseId}`, {
    headers: {'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
  })

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Failed to fetch courses: ${response.status} - ${errorText}`);
    }
    
    const coursesDetails = await response.json();
    return coursesDetails;
    
}

export const fetchCourseTopics = async(courseId) => {
  const APIkey = API;
  const secretKey = secret; // You need to get this from Tutor LMS
  
  const credentials = btoa(`${APIkey}:${secretKey}`);
  const response = await fetch(`https://wordpress-1494981-5707436.cloudwaysapps.com/wp-json/tutor/v1/topics?course_id=${courseId}`, {
    headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
  })

  if (!response.ok){
    throw new Error("failed to fetch course topics ", response.status )
  }

  const topics = await response.json()
  return topics
}

// Simple function to fetch all LearnPress courses



export default fetchAllCourses;

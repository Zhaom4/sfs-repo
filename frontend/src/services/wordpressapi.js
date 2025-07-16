const fetchAllCourses = async () => {
  const APIkey = 'key_54ee0936b76e3cd746fbc9875c938bdc';
  const secretKey = 'secret_2b55d50a1bd4dfbe33cd21cc7059d5afdb098be9a29d72a68c12208f017027bc'; // You need to get this from Tutor LMS
  
  // Create Basic Auth credentials (same as Postman's Basic Auth)
  const credentials = btoa(`${APIkey}:${secretKey}`);
  console.log('Making API call to Tutor LMS...');

  try {
    const response = await fetch('https://wordpress-1491895-5691655.cloudwaysapps.com/wp-json/tutor/v1/courses?per_page=100', {
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
    console.log('Courses received:', courses);
    return courses;
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return null;
  }
};

export const fetchSingleCourse = async(courseId) => {
  const APIkey = 'key_54ee0936b76e3cd746fbc9875c938bdc';
  const secretKey = 'secret_2b55d50a1bd4dfbe33cd21cc7059d5afdb098be9a29d72a68c12208f017027bc'; // You need to get this from Tutor LMS
  
  const credentials = btoa(`${APIkey}:${secretKey}`);

  const response = await fetch(`https://wordpress-1491895-5691655.cloudwaysapps.com/wp-json/tutor/v1/courses/${courseId}`, {
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
    console.log('Course details received:', coursesDetails);
    return coursesDetails;
    
}

export const fetchCourseTopics = async(courseId) => {
  const APIkey = 'key_54ee0936b76e3cd746fbc9875c938bdc';
  const secretKey = 'secret_2b55d50a1bd4dfbe33cd21cc7059d5afdb098be9a29d72a68c12208f017027bc'; // You need to get this from Tutor LMS
  
  const credentials = btoa(`${APIkey}:${secretKey}`);
  const response = await fetch(`https://wordpress-1491895-5691655.cloudwaysapps.com/wp-json/tutor/v1/topics?course_id=${courseId}`, {
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
const fetchAllCourses2 = async () => {
  const username = 'hiemily';
  const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8'; // From WordPress admin
  
  const credentials = btoa(`${username}:${appPassword}`);
  
  try {
    const response = await fetch('https://studentsforstudents.fast-page.org/wp-json/lp/v1/courses?context=edit', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    
    const courses = await response.json();

    return courses;
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return null;
  }
};



export default fetchAllCourses;

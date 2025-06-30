// Simple function to fetch all LearnPress courses
const fetchAllCourses = async () => {
  const username = 'hiemily';
  const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8'; // From WordPress admin
  
  const credentials = btoa(`${username}:${appPassword}`);
  
  try {
    const response = await fetch('https://studentsforstudents.fast-page.org/wp-json/wp/v2/lp_course', {
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
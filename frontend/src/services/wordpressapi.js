// Simple function to fetch all LearnPress courses
const fetchAllCourses = async () => {
  const username = 'hiemily';
  const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8'; // From WordPress admin
  
  const credentials = btoa(`${username}:${appPassword}`);
  
  try {
    const response = await fetch('https://studentsforstudents.fast-page.org/wp-json/lp/v1/courses', {
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

// export const fetchCourseDetails = async(key) => {
//   const username = 'hiemily';
//   const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8'; // From WordPress admin
//   const credentials = btoa(`${username}:${appPassword}`);

//   try{
//     const response = await fetch(`https://studentsforstudents.fast-page.org/wp-json/lp/v1/courses/${key}`, {
//       headers: {
//         'Authorization': `Basic ${credentials}`,
//         'Content-Type': 'application/json'
//       }, 
//       method: 'GET'
//     });

//     if (!response.ok){
//       throw new Error('Error: ', response.status);
//     }

//     const message = await response.json();

//     return message;
//   } catch (error){
//       console.error('Error fetching courses:', error);
//       return null;
//   }

// }

export const fetchCourseLessons = async (courseId) => {
  const username = 'hiemily';
  const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8';
  const credentials = btoa(`${username}:${appPassword}`);


  try {
    const response = await fetch(`https://studentsforstudents.fast-page.org/wp-json/lp/v1/courses/${courseId}/`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.status}`);
    }

    const curriculum = await response.json();
    return curriculum;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return null;
  }
};


export default fetchAllCourses;

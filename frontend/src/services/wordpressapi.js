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

export const getThumbnailUrl = async (course) => {
  const username = 'hiemily';
  const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8';
  const credentials = btoa(`${username}:${appPassword}`);
  
  // Check if course has featured_media
  if (!course.featured_media) {
    return null;
  }

  try {
    // Use the media ID to fetch the thumbnail
    const response = await fetch(`https://studentsforstudents.fast-page.org/wp-json/wp/v2/media/${course.featured_media}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const media = await response.json();
    return media.source_url; // This is the thumbnail URL
    
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    return null;
  }
};


// export const fetchCoursesTest = async() => {
//   const username = 'hiemily';
//   const appPassword = 'Nmp7 59Ti fktD kjQZ Uas6 Kkd8'; // From WordPress admin
  
//   const credentials = btoa(`${username}:${appPassword}`);
  
//   try {
//     const response = await fetch('https://studentsforstudents.fast-page.org/wp-json/lp/v1/courses', {
//       headers: {
//         'Authorization': `Basic ${credentials}`,
//         'Content-Type': 'application/json'
//       }, 
//       method: 'GET', 
      
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch courses: ${response.status}`);
//     }
    
//     const courses = await response.json();

//     return courses.data.courses;
    
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     return null;
//   }
// }


export default fetchAllCourses;

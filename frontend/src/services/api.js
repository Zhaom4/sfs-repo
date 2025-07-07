export function addToFavorites(courseId){
  let favorites = JSON.parse(localStorage.getItem('favorites') || []);
  favorites.push(courseId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function removeFromFavorites(courseId){
  let favorites = JSON.parse(localStorage.getItem("favorites") || []);
  const ind = favorites.findIndex(id => id===courseId);
  if (ind > - 1 ) favorites.splice(ind, 1)
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function isFavorited(courseId){
  let favorites = JSON.parse(localStorage.getItem("favorites") || []);
  return favorites.includes(courseId)
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

//my courses 

export function removeFromEnrolled(courseId){
  let enrolled = JSON.parse(localStorage.getItem("my-courses") || []);
  const ind = enrolled.findIndex(id => id===courseId);
  if (ind > - 1 ) enrolled.splice(ind, 1)
  localStorage.setItem('my-courses', JSON.stringify(enrolled));
}


export function addToMyCourses(courseID){
  let myCourses = JSON.parse(localStorage.getItem('my-courses') || '[]');
  myCourses.push(courseID);
  localStorage.setItem('my-courses', JSON.stringify(myCourses));
}

export function isEnrolled(courseID){
  let myCourses = JSON.parse(localStorage.getItem('my-courses') || '[]');
  return myCourses.includes(courseID);
}

export function getMyCourses(){
  return JSON.parse(localStorage.getItem('my-courses') || '[]');
}

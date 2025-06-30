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


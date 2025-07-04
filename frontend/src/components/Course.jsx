import clsx from "clsx";
import styles from '../components/Course.module.css'
import { useEffect, useState } from "react";
import { addToFavorites, removeFromFavorites, isFavorited } from "../services/api";
import { Link } from "react-router-dom";
import fetchAllCourses from "../services/wordpressapi";
import { getThumbnailUrl } from "../services/wordpressapi";

function Course({course, onFavoriteChange, ind}){
  const [favorite, changeFavorite] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  
  useEffect(() => {
    changeFavorite(isFavorited(course.ID));
    const url = getThumbnailUrl(course);
    setThumbnail(url);
  }, [course.ID]);

  function toggleFavorite(e){
    e.preventDefault();
    e.stopPropagation();
    
    // Check current state and update accordingly
    if (favorite){
      removeFromFavorites(course.ID); 
      changeFavorite(false); 
    } else{
      addToFavorites(course.ID); 
      changeFavorite(true); 
    }
    if (onFavoriteChange){
      onFavoriteChange();
    }
  }

  const getInstructorName = (htmlString) => {
    const match = htmlString.match(/<span class="instructor-display-name">(.*?)<\/span>/);
    return match ? match[1] : 'Unknown Instructor';
  };

  const getPrice = (htmlString) => {
    const priceMatch = htmlString.match(/<span class="price">(.*?)<\/span>/);
    if (priceMatch) {
      return priceMatch[1].replace(/&#036;/g, "$").trim();
    }

    const originalMatch = htmlString.match(
      /<span class="origin-price">(.*?)<\/span>/
    );
    if (originalMatch) {
      return originalMatch[1].replace(/&#036;/g, "$").trim();
    }

    return "Free";
  };

  const getThumbnail = (htmlString) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const imgElement = tempDiv.querySelector('img');
    const imgUrl = imgElement ? imgElement.src : null;
    return imgUrl;
  }

  const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  };

  return (
    <div className={styles["course"]}>
      <Link 
        to={`/course/${course.ID}`}
        className={styles.courseWrapper}
        style={{ textDecoration: 'none' }}
      >
        <div
          className={styles["course-thumbnail"]}
          style={{ backgroundImage: `url(${getThumbnail(course.image)})` }}
        >
          <div className={styles["figcaption"]}>
            <p className={styles["fig-desc"]}>{}</p>
            <button 
              className={styles["favorite"]} 
              onClick={toggleFavorite}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={favorite ? "#FFD700" : "none"}
                stroke="#FFFFFF"
                strokeWidth="60"
              >
                <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className={styles["bottom-desc"]}>
          <div className={styles.left}>
            <div className={styles["desc-container"]}>
              <div className={styles["desc"]}>{decodeHtmlEntities(course.title)}</div>
            </div>
            <div className={styles["profile-section"]}>
              <button className={styles["icon"]}></button>
              <div>
                <div className={styles["creator"]}>{
                  getInstructorName(course.instructor)
              }</div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            {getPrice(course.price)}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Course;


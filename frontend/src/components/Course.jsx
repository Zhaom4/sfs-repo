import clsx from "clsx";
import styles from '../components/Course.module.css'
import { useEffect, useState } from "react";
import { addToFavorites, removeFromFavorites, isFavorited } from "../services/api";
import { Link } from "react-router-dom";

function Course({course, onFavoriteChange}){
  const [favorite, changeFavorite] = useState(false);
  
  useEffect(() => {
    changeFavorite(isFavorited(course.id));
  }, [course.id]);

  function toggleFavorite(e){
    e.preventDefault();
    e.stopPropagation();
    
    // Check current state and update accordingly
    if (favorite){
      removeFromFavorites(course.id); 
      changeFavorite(false); 
    } else{
      addToFavorites(course.id); 
      changeFavorite(true); 
    }
    if (onFavoriteChange){
      onFavoriteChange();
    }
  }

  return (
    <div className={styles["course"]}>
      <Link 
        to={`/course/${course.id}`}
        className={styles.courseWrapper}
        style={{ textDecoration: 'none' }}
      >
        <div
          className={styles["course-thumbnail"]}
          style={{ backgroundImage: `url(${course.thumbnail})` }}
        >
          <div className={styles["figcaption"]}>
            <p className={styles["fig-desc"]}>{course.desc}</p>
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
              <div className={styles["desc"]}>{course.title.slice(0, -1)}</div>
            </div>
            <div className={styles["profile-section"]}>
              <button className={styles["icon"]}></button>
              <div>
                <div className={styles["creator"]}>{course.author}</div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            {`$${course.price}`}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Course;
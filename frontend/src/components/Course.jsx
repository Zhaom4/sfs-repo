import clsx from "clsx";
import styles from '../components/Course.module.css'
import { useEffect, useState } from "react";
import { addToFavorites, removeFromFavorites, isFavorited, removeFromEnrolled, addToMyCourses } from "../services/api";
import { Link, useLocation } from "react-router-dom";
import { getThumbnail, decodeHtmlEntities, extractText } from "../services/helpers";
import { isEnrolled } from "../services/api";

function Course({course, onFavoriteChange, onEnrolledChange}){
  const [favorite, changeFavorite] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname==='/mainpg'){setEnrolled(false)}
    if (location.pathname==='/my-courses'){setEnrolled(true)}
    changeFavorite(isFavorited(course.ID));

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

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check current state and update accordingly
    if (enrolled){
      removeFromEnrolled(course.ID); 
      setEnrolled(false); 
    } else{
      addToMyCourses(course.ID); 
      setEnrolled(true); 
    }
    if (onEnrolledChange){
      onEnrolledChange();
    }
  }

  return (
    <div className={styles["course"]}>
      <Link
        to={`/course/${course.ID}`}
        className={styles.courseWrapper}
        style={{ textDecoration: "none" }}
      >
        <div
          className={styles["course-thumbnail"]}
          style={{ backgroundImage: `url(${getThumbnail(course.image)})` }}
        >
          <div className={styles["figcaption"]}>
            <p className={styles["fig-desc"]}>{}</p>
            {!enrolled ? (
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
            ) : (
              <button
                className={styles["remove"]}
                onClick={handleRemove}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FF4444"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className={styles["bottom-desc"]}>
          <div className={styles.left}>
            <div className={styles["desc-container"]}>
              <div className={styles["desc"]}>
                {decodeHtmlEntities(course.title)}
              </div>
            </div>
            <div className={styles["profile-section"]}>
              <button className={styles["icon"]}></button>
              <div>
                <div className={styles["creator"]}>
                  {extractText(course.instructor, "course-instructor")}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            {extractText(course.level, "course-level")}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Course;


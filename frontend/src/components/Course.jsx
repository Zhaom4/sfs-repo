import clsx from "clsx";
import styles from '../components/Course.module.css'
import { useState } from "react";

function Course({course}){

  const [favorite, changeFavorite] = useState(false);
  function toggleFavorite(){
    changeFavorite((prev) => !prev);
  }
  return (
    <div key={course.id} className={styles["course"]} onClick={(e)=>{console.log(e)}}>
      <div
        className={styles["course-thumbnail"]}
        style={{ backgroundImage: `url(${course.thumbnail})` }}
      >
        <div className={styles["figcaption"]}>
          <p className={styles["fig-desc"]}>{course.desc2}</p>
          <button className={styles["favorite"]} onClick={toggleFavorite}>
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
            <div className={styles["desc"]}>{course.desc.slice(0, -1)}</div>
            {/* <div className={styles["date"]}>{course.date}</div> */}
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
    </div>
  );
}

export default Course;
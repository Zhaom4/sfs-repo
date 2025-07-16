import clsx from "clsx";
import styles from '../components/Course.module.css'
import { useEffect, useState } from "react";
import { addToFavorites, removeFromFavorites, isFavorited, removeFromEnrolled, addToMyCourses } from "../services/api";
import { Link, useLocation } from "react-router-dom";
import { getThumbnail, decodeHtmlEntities, extractText } from "../services/helpers";
import { isEnrolled } from "../services/api";
import ConfirmationModal from "./ConfirmationModal";
import { useCursor, useCursorInteractions } from "../contexts/CursorContext";
import { fetchSingleCourse, fetchCourseTopics } from "../services/wordpressapi";
import { prettierWord } from "../services/helpers";

function Course({course, onFavoriteChange, onEnrolledChange}){
  const [favorite, changeFavorite] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const location = useLocation();
  const {hover, resetCursor} = useCursor()
  const [courseDetails, setCourseDetails] = useState({})
  const [detailsLoading, setDetailsLoading] = useState(true)
  
  useEffect(() => {
    const fetchCourseDetails = async() => {
      try {
        const details = await fetchSingleCourse(course.ID);
        setCourseDetails(details.data)

      } catch {
        throw new Error("couldn't get course details")
      } finally{
        setDetailsLoading(false)
      }
    }

  const getCourseTopics = async() => {
    const response = await fetchCourseTopics(course.ID)
    if (response){
      console.log('topics: ', response)
    }
  }
    if (location.pathname==='/mainpg'){setEnrolled(false)}
    if (location.pathname==='/my-courses'){setEnrolled(true)}
    changeFavorite(isFavorited(course.ID));

    fetchCourseDetails();
    getCourseTopics();
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

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    removeFromEnrolled(course.ID); 
    setEnrolled(false);
    setShowRemoveModal(false);
    
    if (onEnrolledChange){
      onEnrolledChange();
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
  };

  useEffect(()=>{
      console.log('Course details in course component', courseDetails)

  }, [courseDetails])

  if (detailsLoading){
    return(
      <></>
    )
  }
  return (
    <>
      <div className={styles["course"]}
      onMouseEnter={(hover)}
      onMouseLeave={(resetCursor)}>

        <Link
          to={`/course/${course.ID}`}
          className={styles.courseWrapper}
          style={{ textDecoration: "none" }}
        >
          <div
            className={styles["course-thumbnail"]}
            style={{ backgroundImage: `url(${course.thumbnail_url})` }}
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
                  onClick={handleRemoveClick}
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
                  {decodeHtmlEntities(course.post_title)}
                </div>
              </div>
              <div className={styles["profile-section"]}>
                <button className={styles["icon"]}></button>
                <div>
                  <div className={styles["creator"]}>
                    {course.post_author.display_name}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              {prettierWord(courseDetails.course_level[0])}
            </div>
          </div>
        </Link>
      </div>

      <ConfirmationModal
        isOpen={showRemoveModal}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Are you sure you want to remove this course?"
        message="This will remove the course from your enrolled courses."
        subMessage="Don't worry, you can re-enroll at any time."
        confirmText="Remove Course"
        cancelText="Cancel"
      />
    </>
  );
}

export default Course;
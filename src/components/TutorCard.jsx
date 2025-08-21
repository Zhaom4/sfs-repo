// Updated TutorCard.jsx
import styles from './TutorCard.module.css';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useCourses } from '../contexts/CourseContext';
import Course from './Course';
import CompactCourse from './CompactCourse';

const TutorCard = ({ user, em, isScheduleOpen }) => {
  const [infoOpened, setInfoOpened] = useState(false);
  const {courseList, loading} = useCourses()

  // Auto-open info when this tutor's schedule is open
  useEffect(() => {
    if (isScheduleOpen) {
      setInfoOpened(true)
    }
  }, [isScheduleOpen])

  const capitalize = (string) => {
    return string.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCourse = (id) => {
    if (courseList.length > 0){
      console.log('RIGHT HEREEEEE', courseList.find(course => course.ID === Number(id)))
      return courseList.find(course => course.ID === Number(id))
    }
  }

  const toggleOpened = () => {
    setInfoOpened(!infoOpened)
  }

  const handleScheduleClick = (e) => {
    e.stopPropagation() // Prevent the card toggle when clicking schedule
    em(user.user_email)
  }

  console.log(user)
  console.log(courseList)
  console.log('FIRST COURSE!!!', getCourse(user.courses[0]))
  console.log(user.courses[0])
  
  return (
    <div className={styles.tutorCard} onClick={toggleOpened}>
      <div className={styles.init}>
        <div className={styles.left}>
          <div className={styles["profile-section"]}>
            <button className={styles["icon"]}></button>
            <div className={styles.userInfo}>
              <div className={styles["creator"]}>
                {capitalize(user.display_name)}
              </div>
              <div className={styles["email"]}>
                {user.user_email}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <button 
            className={`${styles.scheduleBtn} ${isScheduleOpen ? styles.active : ''}`} 
            onClick={handleScheduleClick}
          >
            Schedule
          </button>
        </div>
      </div>
      
      {infoOpened && (
        <>
          <div className={styles.cont}>
            <div className={styles.addInfo}>Courses created</div>
            <svg className={styles.courseIcon} viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.courseScroller}>
            {user.courses.map((course, index) => {
              return(
                <CompactCourse key={index} course={getCourse(course)} />
              )
            })}
          </div>
          <div className={styles.date}>
            Joined {formatDate(user.user_registered)}
          </div> 
        </>
      )}
    </div>
  );
};

export default TutorCard;
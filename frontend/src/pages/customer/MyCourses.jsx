import styles from '../customer/Favorites.module.css'
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import Course from '../../components/Course';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from '../../assets/sad-face.json';
import {gsap} from 'gsap';
import { useCourses } from '../../contexts/CourseContext';
import { getMyCourses } from '../../services/api';


function MyCourses(){
  const {courseList, loading} = useCourses();
  const [myCourses, setMyCourses] = useState([])

  const refreshEnrolled = () => {
    const ids = getMyCourses();
      // setFavoriteIds(ids);
        const fullCourses = courseList.filter(course => ids.includes(course.ID));
        setMyCourses(fullCourses);
  }
  useEffect(()=>{
    refreshEnrolled();
  }, [courseList, loading])

  if (loading){
    return(
      <NavBar></NavBar>
    )
  }
  return(
    <>
          <NavBar />
          {myCourses.length != 0 ? (
            <section className={styles["main-section"]}>
              {myCourses.map((course) => {
                return (
                  <Course
                    key={course.ID}
                    course={course}
                    onEnrolledChange={refreshEnrolled}
                  />
                );
              })}
            </section>
          ) : (
            <section className={styles.section2}>
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: 200, marginBottom: '-2rem'}}
              />
              <div className={styles.no}>You have no courses!</div>
              <Link to={"/mainpg"} className={styles.return}>
                Return to dashboard{" "}
              </Link>
            </section>
          )}
        </>
  )
}

export default MyCourses;
import styles from '../customer/Favorites.module.css'
import { getFavorites } from '../../services/api';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import Course from '../../components/course';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from '../../assets/sad-face.json';
import {gsap} from 'gsap';
import { useCourses } from '../../contexts/CourseContext';


function Favorites() {
  // const [favoriteIds, setFavoriteIds] = useState([])
  const [favoriteCourses, setFavoriteCourses] = useState([])
  const {courseList, loading} = useCourses();

  const refreshFavorites = () =>{
    const ids = getFavorites();
  // setFavoriteIds(ids);
    const fullCourses = courseList.filter(course => ids.includes(course.ID));
    setFavoriteCourses(fullCourses);
  }

  useEffect(()=>{
    refreshFavorites();
  }, [])


  return (
    <>
      <NavBar />
      {favoriteCourses.length != 0 ? (
        <section className={styles["main-section"]}>
          {favoriteCourses.map((course) => {
            return (
              <Course
                key={course.ID}
                course={course}
                onFavoriteChange={refreshFavorites}
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
          <div className={styles.no}>You have no favorites!</div>
          <Link to={"/mainpg"} className={styles.return}>
            Return to dashboard{" "}
          </Link>
        </section>
      )}
    </>
  );
}

export default Favorites;
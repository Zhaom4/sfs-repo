import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
// import { courses } from "../../services/courses";
import Course from "../../components/course";
import fetchAllCourses from "../../services/wordpressapi";
import { useCourses } from "../../contexts/CourseContext";
import Loader from "../../components/Loader";
import clsx from "clsx";

function MainPage() {
  const {courseList, loading} = useCourses();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    if (!loading){
      setFadeOut(true);

      setTimeout(()=>{
        setShowLoader(false)
      }, 500)
    }

  }, [loading]);
  if (showLoader){
    return(
      <div className={clsx(
        styles['loader-container'], 
        fadeOut && styles['fade']
      )}>
      <Loader ></Loader>
      </div>
    )
  }
  return (
    <>
      <NavBar></NavBar>
      <Sidebar></Sidebar>
      <div className={styles["container"]}>
        
        <section className={styles["main-section"]}>
          {courseList.map((course) => {
            console.log(course);
            return (
                <Course key={course.ID} course={course} ind={courseList.indexOf(course)}/>
            );
          })}
        </section>
      </div>
    </>
  );
}


export default MainPage;
import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
// import { courses } from "../../services/courses";
import Course from "../../components/course";
import fetchAllCourses from "../../services/wordpressapi";
import { useCourses } from "../../contexts/CourseContext";

function MainPage() {
  const {courseList, loading} = useCourses();
  
  useEffect(() => {

  }, []);

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
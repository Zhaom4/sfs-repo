import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
// import { courses } from "../../services/courses";
import Course from "../../components/course";
import fetchAllCourses from "../../services/wordpressapi";

function MainPage() {
  const [courseList, setCourseList] = useState([]);
  
  useEffect(() => {
    const fetchCourses = async() => {
      const response = await fetchAllCourses();
      if (response){
        setCourseList(response.data.courses);
        console.log(response);
      }
    }

    fetchCourses();
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
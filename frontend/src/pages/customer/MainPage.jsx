import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { courses } from "../../services/courses";
import Course from "../../components/course";
import { Link } from "react-router-dom"; // Use Link instead of useNavigate

function MainPage() {
  const [courseList, setCourseList] = useState([]);
  
  useEffect(() => {
    setCourseList(courses);
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <Sidebar></Sidebar>
      <div className={styles["container"]}>
        
        <section className={styles["main-section"]}>
          {courseList.map((course) => {
            return (
                <Course key={course.id} course={course}/>
            );
          })}
        </section>
      </div>
    </>
  );
}

export default MainPage;
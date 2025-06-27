import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { courses } from "../../services/api";
import clsx from "clsx";
import Course from "../../components/course";

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
              <button className={styles.courseWrapper}>
                <Course course={course}/>
              </button>
            );
          })}
        </section>
      </div>
    </>
  );
}

export default MainPage;

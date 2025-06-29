import NavBar from "../../components/NavBar";
import styles from "../customer/MainPage.module.css";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { courses } from "../../services/api";
import Course from "../../components/course";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setCourseList(courses);
  }, []);

  const handleClick = (id) => {
    navigate(`/course/${id}`)
  }

  return (
    <>
      <NavBar></NavBar>
      <Sidebar></Sidebar>
      <div className={styles["container"]}>
        
        <section className={styles["main-section"]}>
          {courseList.map((course) => {
            return (
              <button className={styles.courseWrapper}
              key={course.id}
              onClick={() => handleClick(course.id)}
              >
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

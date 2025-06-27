import NavBar from "../../components/NavBar";
import styles from '../customer/CoursePage.module.css';
import Course from "../../components/course";

function CoursePage({course}){
  return (
    <div className={styles.container}>
      <NavBar />
      <section className={styles['course-intro']}>
        {/* <Course course={course}></Course> */}
        
      </section>
    </div>
  );
}

export default CoursePage;
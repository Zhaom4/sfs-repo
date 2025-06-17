import NavBar from "../../components/NavBar"
import styles from "../customer/MainPage.module.css"
import Sidebar from "../../components/Sidebar"
import { useState, useEffect } from "react"

function MainPage(){
  const [courses, updateCourses] = useState([...Array(15).keys()])
  return(
    <>
      <NavBar></NavBar>
      <Sidebar></Sidebar>
    <section className={styles["main-section"]}>
      
      {courses.map((course)=>{
        return <div className={styles["course"]} key={course}>{course}</div>
      })}
    </section>
    </>
  )
}

export default MainPage
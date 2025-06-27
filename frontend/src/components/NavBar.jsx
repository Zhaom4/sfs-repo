import styles from '../components/NavBar.module.css'
import clsx from 'clsx'
import { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import ProfileDropdown from './ProfileDropdown';

function NavBar(){
  const [activebtn, changeActivebtn] = useState('dashboard');
  const [open, setOpen] = useState(false);

  const handleClick = (btnName) => {
    changeActivebtn(btnName)
  }
  
  return (
    <>
      <div className={styles["navBar"]}>
        <div className={styles["left"]}>SFS</div>
        <div className={styles["search-bar"]}>
          <FaSearch className={styles["search-icon"]} />
          <input type="text" placeholder="Search" />
          <div className={styles["shortcut"]}>
            <span className={styles["key"]}>⌘</span>
            <span className={styles["key"]}>K</span>
          </div>
        </div>
        <div className={styles["right"]}>
          <button
            className={clsx(
              styles["nav-btn"],
              activebtn === "dashboard" && styles["active"]
            )}
            onClick={() => handleClick("dashboard")}
          >
            dashboard
          </button>
          <button
            className={clsx(
              styles["nav-btn"],
              activebtn === "my-courses" && styles["active"]
            )}
            onClick={() => handleClick("my-courses")}
          >
            my courses
          </button>
          <button className={clsx(styles["favorites"], styles["nav-btn"])}>
            <svg
              className={clsx(
                styles["favorites-svg"],
                activebtn === "favorites" && styles["active"]
              )}
              onClick={() => handleClick("favorites")}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
            </svg>
          </button>
          <button className={styles["profile-icon"]} onClick={()=>{setOpen(!open)}}>
              <ProfileDropdown open={open}></ProfileDropdown>
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar
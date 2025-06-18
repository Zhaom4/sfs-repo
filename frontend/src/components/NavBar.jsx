import styles from '../components/NavBar.module.css'
import clsx from 'clsx'
import { useState } from 'react'

function NavBar(){
  const [activebtn, changeActivebtn] = useState('dashboard')
  const handleClick = (btnName) => {
    changeActivebtn(btnName)
  }
  
  return (
    <>
      <div className={styles["navBar"]}>
        <div className={styles["left"]}>SFS</div>
        <div className={styles["right"]}>
          <button
            className={clsx(styles["nav-btn"], 
              activebtn === 'dashboard' && styles['active']
            )}
            onClick={() => handleClick('dashboard')}
          >
            dashboard
          </button>
          <button
            className={clsx(styles["nav-btn"], 
            activebtn === 'my-courses' && styles['active']

            )}
            onClick={() => handleClick("my-courses")}
          >
            my courses
          </button>
          <button className={styles["profile-icon"]}></button>
        </div>
      </div>
    </>
  );
}

export default NavBar
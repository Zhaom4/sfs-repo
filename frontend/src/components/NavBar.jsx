import styles from '../components/NavBar.module.css'

function NavBar(){
  return(
    <>
      <div className={styles['navBar']}>
        <div className={styles['left']}>SFS</div>
        <div className={styles['right']}>
          <button>dashboard</button>
          <button>my courses</button>
          <button className={styles['profile-icon']}></button>
        </div>

      </div>
    </>
  )
}

export default NavBar
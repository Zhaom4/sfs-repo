import styles from '../components/Loader.module.css'

function Loader() {
  return(
    <div className={styles["loader-container"]}>
      <svg className={styles.sc} viewBox="0 0 400 160">
        <text x='50%' y='50%' dy='.32rem' textAnchor="middle" className={styles['text-body']}>
          SFS
        </text>
      </svg>
    </div>
  )
}

export default Loader;
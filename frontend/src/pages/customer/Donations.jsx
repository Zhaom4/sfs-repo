import NavBar from '../../components/NavBar';
import styles from './Donations.module.css';
import gsap from 'gsap';
import { getCursor } from '../../services/cursorManager';

function Donations(){

  return (
    <div className={styles.container}>
      <NavBar></NavBar>
      <section className={styles.head}
      >
        <div className={styles.squares}>
          <div className={styles.square}></div>
          <div className={styles.square}></div>
        </div>

        <div className={styles["book-container"]}>
          <div className={styles.book}></div>
          <div className={styles.book}></div>
        </div>
        <div className={styles.left} style={{color: 'white'}}>
          <h1 className={styles.header1}>
            Make a difference in accessible education.
          </h1>
          <h3 className={styles.header2}>Your impact is just one click away.</h3>
          <button className={styles['donate-btn']}
          onClick={()=> window.open('https://gofund.me/07060664')}
          >Donate</button>
        </div>
        <div className={styles['computer']}></div>
      </section>
      <section className={styles['our-mission']}>
        <div className={styles.tag}>
          
        </div>
      </section>
      <section className={styles['body1']}>
        <h1 className={styles.header1}>Where your money goes</h1>
        {/* <hr className={styles.line}></hr> */}
        <div className={styles['reason-container']}>
          <div className={styles.reason}>

          </div>
          <div className={styles.reason}>
    
          </div>
          <div className={styles.reason}>
    
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default Donations;
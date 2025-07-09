import NavBar from '../../components/NavBar';
import styles from './Donations.module.css';
import gsap from 'gsap';
import { getCursor } from '../../services/cursorManager';

function Donations(){

  // const cursor = getCursor();

  // const handleMouseEnter = () => {
  //   if (cursor) {
  //     gsap.to(cursor, {
  //       width: 20,
  //       height: 20,
  //       backgroundColor: "rgba(0,0,0,0)", 
  //       borderWidth: 1,
  //       duration: 0.2, 
  //       ease: "power2.inOut"
  //     });
  //   }
  // }

  // const handleMouseLeave = () => {
  //   if (cursor) {
  //     gsap.to(cursor, {
  //       width: 15,
  //       height: 15,
  //       backgroundColor: "rgb(255, 255, 255)", 
  //       borderWidth: 0,
  //       duration: 0.2, 
  //       ease: "power2.inOut"
  //     });
  //   }
  // }

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
          YAY
        </div>
      </section>
    </div>
  );
}

export default Donations;
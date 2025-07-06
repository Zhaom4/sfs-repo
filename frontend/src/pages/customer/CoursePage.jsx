import NavBar from "../../components/NavBar";
import styles from '../customer/CoursePage.module.css';
import { useEffect, useState } from "react";
import { Heart, Play, Clock, Users, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCourses } from "../../contexts/CourseContext";
import { getPrice, getInstructorName, getThumbnail, decodeHtmlEntities } from '../../services/helpers';
import { addToFavorites, removeFromFavorites, isFavorited } from "../../services/api";

export default function CoursePage(){
  const {id} = useParams();
  const {courseList, loading} = useCourses();
  const course = courseList.find((c) => String(c.ID) === id); // String match for safety
  const [Favorited, setFavorited] = useState(false);

  useEffect(()=>{
    if (course && isFavorited(course.ID)){
      setFavorited(true);
    }
  }, [course])
  
  if (loading || !course){
    return(
      <div>Loading...</div>
    )
  }

  
  return (
  
    <div className={styles.container}>
      <NavBar />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            <div className={styles.courseInfo}>
              <div className={styles.courseTags}>
                <span className={`${styles.tag} ${styles.tagProgramming}`}>
                  Programming
                </span>
                <span className={`${styles.tag} ${styles.tagBeginner}`}>
                  Beginner Friendly
                </span>
              </div>

              <h1 className={`${styles.title} ${styles.titleGradient }`}>
                {decodeHtmlEntities(course.title)}
              </h1>

              <p className={styles.description}>
                {course.author}
              </p>
            </div>

            {/* Course Stats */}
            <div className={styles.courseStats}>
              <div className={styles.stat}>
                <Clock className={styles.statIcon} />
                <span>12 hours</span>
              </div>
              <div className={styles.stat}>
                <Users className={styles.statIcon} />
                <span>2.3k students</span>
              </div>
              <div className={styles.stat}>
                <Star className={`${styles.statIcon} ${styles.starIcon}`} />
                <span>4.8 (324 reviews)</span>
              </div>
            </div>

            {/* CTA Buttons - Mobile */}
            <div className={styles.ctaButtonsMobile}>
              <button className={styles.purchaseBtn}>
                {`Purchase Course  -  ${course.price}`}
              </button>
              <button
                onClick={() => {
                  Favorited ? removeFromFavorites(course.ID) : addToFavorites(course.ID);
                  setFavorited(!Favorited)
                }}
                className={`${styles.favoriteBtn} ${
                  Favorited
                    ? styles.favoriteBtnActive
                    : styles.favoriteBtnDefault
                }`}
              >
                <Heart
                  className={`${styles.heartIcon} ${
                    Favorited ? styles.heartIconFilled : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className={styles.rightContent}>
            {/* Course Thumbnail */}
            <div className={styles.thumbnailContainer}>
              <div className={styles.thumbnail}>
                <img
                  src={`${getThumbnail(course.image)}`}
                  alt="Python Course Thumbnail"
                  className={styles.thumbnailImage}
                />

                {/* Play Button Overlay */}
                <div className={styles.playOverlay}>
                  <button className={styles.playBtn}>
                    <Play className={styles.playIcon} />
                  </button>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => {
                    Favorited ? removeFromFavorites(course.ID) : addToFavorites(course.ID);
                    setFavorited(!Favorited)

                  }}
                  className={`${styles.thumbnailFavoriteBtn} ${
                    Favorited
                      ? styles.thumbnailFavoriteBtnActive
                      : styles.thumbnailFavoriteBtnDefault
                  }`}
                >
                  <Heart
                    className={`${styles.thumbnailHeartIcon} ${
                      Favorited ? styles.heartIconFilled : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* CTA Buttons - Desktop */}
            <div className={styles.ctaButtonsDesktop}>
              <button className={styles.purchaseBtn}>
                {`Purchase Course  -  ${getPrice(course.price)}`}
              </button>
            </div>

            {/* Course Features */}
          </div>
        </div>

        {/* Animated Gradient Line */}
        <div className={styles.gradientLine}>
          <div className={styles.gradientLineInner}></div>
        </div>
        <div className={styles.featuresCard}>
          <h3 className={styles.featuresTitle}>What you'll learn:</h3>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <div
                className={`${styles.featureDot} ${styles.featureDotGreen}`}
              ></div>
              <span className={styles.featureText}>
                Python syntax and fundamental programming concepts
              </span>
            </li>
            <li className={styles.featureItem}>
              <div
                className={`${styles.featureDot} ${styles.featureDotBlue}`}
              ></div>
              <span className={styles.featureText}>
                Building real-world projects and applications
              </span>
            </li>
            <li className={styles.featureItem}>
              <div
                className={`${styles.featureDot} ${styles.featureDotGreen}`}
              ></div>
              <span className={styles.featureText}>
                Integration with modern AI development tools
              </span>
            </li>
            <li className={styles.featureItem}>
              <div
                className={`${styles.featureDot} ${styles.featureDotBlue}`}
              ></div>
              <span className={styles.featureText}>
                Industry best practices and clean code principles
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
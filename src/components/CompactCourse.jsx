// CompactCourse.jsx - Create this as a new component for the scroller
import styles from './CompactCourse.module.css';
import { Link } from 'react-router-dom';
const CompactCourse = ({ course }) => {
  if (!course) return null;

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    
    <Link 
    to={`/course/${course.ID}`}
    >
    <div className={styles.compactCourse}>
      <div className={styles.header}>
        <div className={styles.title}>
          {truncateText(decodeHtmlEntities(course.post_title), 50)}
        </div>
      </div>
      
      <div
        className={styles["course-thumbnail"]}
        style={{ backgroundImage: `url(${course.thumbnail_url})` }}
      />
        
      <div className={styles.excerpt}>
        {course.post_excerpt ? 
          truncateText(decodeHtmlEntities(course.post_excerpt), 60) : 
          'No description available'
        }
      </div>
      
      <div className={styles.footer}>
        <div className={styles.tag}>Course</div>
        <div className={styles.date}>
          {new Date(course.post_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
    </Link>
  );
};

export default CompactCourse;
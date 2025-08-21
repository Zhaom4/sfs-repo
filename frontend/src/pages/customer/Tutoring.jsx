// Updated Tutor.jsx
import NavBar from '../../components/NavBar'
import TutorCard from '../../components/TutorCard';
import { CourseProvider, useCourses } from '../../contexts/CourseContext'
import styles from './Tutoring.module.css'
import { useEffect, useState } from 'react'

function Tutor(){
  const {loading, users} = useCourses();
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Calendly script
  useEffect(() => {
    // Check if script is already loaded
    if (window.Calendly) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    script.onload = () => {
      setScriptLoaded(true)
    }
    
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize widget when it becomes visible
  useEffect(() => {
    if (scheduleOpen && email.length > 0 && scriptLoaded && window.Calendly) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Clear any existing processed widgets first
        const widgets = document.querySelectorAll('.calendly-inline-widget');
        widgets.forEach(widget => {
          widget.removeAttribute('data-processed');
          widget.innerHTML = ''; // Clear existing content
        });
        
        // Initialize the new widget
        widgets.forEach(widget => {
          if (widget.dataset.url) {
            window.Calendly.initInlineWidget({
              url: widget.dataset.url,
              parentElement: widget
            });
            widget.setAttribute('data-processed', 'true');
          }
        });
      }, 100);
    }
  }, [scheduleOpen, email, scriptLoaded]);

  const truncateEmail = (email) => {
    return email.split('@')[0];
  }

  const getEmail = (tutorEmail) => {
    console.log('EMAIL!!!!!!!', tutorEmail)
    setEmail(tutorEmail)
    
    // Always ensure schedule is open when a tutor is selected
    if (!scheduleOpen) {
      setScheduleOpen(true)
    }
    // If schedule is already open but different tutor, the useEffect will handle the switch
  }

  return (
    <div className={styles.container}>
      <NavBar></NavBar>
      <div className={styles.widget}>
        <div className={styles.header1}>
          Set up a meeting with one of our qualified tutors for additional help!
        </div>
        <div className={styles.tutorImage}></div>
      </div>
      <div className={styles.scrollIndicator}>
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.flex}>
        <div className={styles.cont1}>
      
      <div className={styles.instructorList}>
        {users.map((user) => (
          <TutorCard 
            key={user.id} 
            user={user} 
            em={getEmail}
            isScheduleOpen={scheduleOpen && email === user.user_email}
          />
        ))}
      </div>
      </div>
      {(scheduleOpen && email.length > 0) && (
        <div className={styles.dynamicCalendly}>
          {/* <div className={styles.email}>{truncateEmail(email)}</div> */}
          {!scriptLoaded && <div>Loading calendar...</div>}
          <div
            className="calendly-inline-widget"
            data-url={`https://calendly.com/${truncateEmail(email)}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=1d1d20&text_color=efeff9&primary_color=3588ff`}
            style={{ height: "600px", width: "500px", overflow: "hidden", minHeight: "600px" }}
          ></div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Tutor
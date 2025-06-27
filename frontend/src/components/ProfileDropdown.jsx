import styles from './ProfileDropdown.module.css';
import { User, HelpCircle, FlaskConical, Settings, LogOut } from "lucide-react";


export default function ProfileDropdown({open}) {

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.item}><User size={16} /> Profile</div>
          <div className={styles.item}><HelpCircle size={16} /> Help</div>
          <div className={styles.divider}></div>
          <div className={styles.item}><FlaskConical size={16} /> Developer Mode</div>
          <div className={styles.divider}></div>
          <div className={styles.item}><Settings size={16} /> Settings</div>
          <div className={styles.item}><LogOut size={16} /> Logout</div>
        </div>
      )}
    </div>
  );
}

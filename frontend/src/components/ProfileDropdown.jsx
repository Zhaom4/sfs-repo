import styles from './ProfileDropdown.module.css';
import { User, HelpCircle, FlaskConical, Settings, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProfileDropdown({ open }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Error logging out: ' + error.message);
    } else {
      navigate('/'); // Redirect to the welcome page
    }
  };

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
          <div className={styles.item} onClick={handleLogout}><LogOut size={16} /> Logout</div>
        </div>
      )}
    </div>
  );
} 

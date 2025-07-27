import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Globe, Moon, LogOut, ChevronRight, Save } from 'lucide-react';
import NavBar from '../../components/NavBar';
import { useUserContext } from '../../hooks/useUserContext';
import { supabase } from '../../lib/supabase';
import styles from './Settings.module.css';

export default function Settings() {
  const { user, updateUserProfile } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: ''
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    promotions: false,
    pushNotifications: true
  });
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showProgress: true,
    showCertificates: true
  });
  
  // General settings
  const [general, setGeneral] = useState({
    language: 'en',
    timezone: 'UTC',
    darkMode: true
  });

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'general', label: 'General', icon: Globe },
    { id: 'account', label: 'Account', icon: LogOut }
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.full_name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.fullName,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGeneralChange = (key, value) => {
    setGeneral(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderProfileSection = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Profile Information</h2>
        <p className={styles.sectionDescription}>Update your personal information and profile details</p>
      </div>

      {message && (
        <div className={styles.successMessage}>
          {message}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Display name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            className={styles.input}
            placeholder="Enter your display name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email address</label>
          <input
            type="email"
            value={profileData.email}
            className={`${styles.input} ${styles.inputDisabled}`}
            disabled
          />
          <span className={styles.helpText}>Your email address cannot be changed</span>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            className={styles.textarea}
            placeholder="Write a short bio about yourself..."
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.primaryButton}
        >
          {loading ? 'Saving...' : 'Update profile'}
        </button>
      </form>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Notification preferences</h2>
        <p className={styles.sectionDescription}>Choose how you want to be notified about activity</p>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Email notifications</span>
            <span className={styles.settingDescription}>Receive notifications via email</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Course updates</span>
            <span className={styles.settingDescription}>Get notified about course progress and new content</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={notifications.courseUpdates}
              onChange={() => handleNotificationChange('courseUpdates')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Promotional emails</span>
            <span className={styles.settingDescription}>Receive promotional emails and special offers</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={notifications.promotions}
              onChange={() => handleNotificationChange('promotions')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Privacy & Security</h2>
        <p className={styles.sectionDescription}>Manage your privacy settings and data visibility</p>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Profile visibility</span>
            <span className={styles.settingDescription}>Control who can see your profile information</span>
          </div>
          <select
            value={privacy.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            className={styles.select}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends only</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Show course progress</span>
            <span className={styles.settingDescription}>Allow others to see your course completion progress</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={privacy.showProgress}
              onChange={() => handlePrivacyChange('showProgress', !privacy.showProgress)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Show certificates</span>
            <span className={styles.settingDescription}>Display your earned certificates on your profile</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={privacy.showCertificates}
              onChange={() => handlePrivacyChange('showCertificates', !privacy.showCertificates)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderGeneralSection = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>General preferences</h2>
        <p className={styles.sectionDescription}>Customize your app experience and regional settings</p>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Language</span>
            <span className={styles.settingDescription}>Choose your preferred language</span>
          </div>
          <select
            value={general.language}
            onChange={(e) => handleGeneralChange('language', e.target.value)}
            className={styles.select}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Timezone</span>
            <span className={styles.settingDescription}>Your local timezone for scheduling</span>
          </div>
          <select
            value={general.timezone}
            onChange={(e) => handleGeneralChange('timezone', e.target.value)}
            className={styles.select}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Theme</span>
            <span className={styles.settingDescription}>Choose between light and dark mode</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={general.darkMode}
              onChange={() => handleGeneralChange('darkMode', !general.darkMode)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Account management</h2>
        <p className={styles.sectionDescription}>Manage your account settings and preferences</p>
      </div>

      <div className={styles.dangerZone}>
        <div className={styles.dangerItem}>
          <div className={styles.dangerInfo}>
            <span className={styles.dangerLabel}>Sign out</span>
            <span className={styles.dangerDescription}>Sign out of your account on this device</span>
          </div>
          <button
            onClick={handleSignOut}
            className={styles.dangerButton}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'privacy':
        return renderPrivacySection();
      case 'general':
        return renderGeneralSection();
      case 'account':
        return renderAccountSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className={styles.container}>
      <NavBar />
      
      <div className={styles.settingsContainer}>
        <div className={styles.sidebar}>
          <nav className={styles.navigation}>
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ''}`}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.content}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}
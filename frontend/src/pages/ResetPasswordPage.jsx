import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required tokens in URL
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    
    if (!access_token || !refresh_token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    // Set the session using the tokens
    const setSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });
      
      if (error) {
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    setSession();
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password updated successfully! Redirecting to main page...');
        setTimeout(() => {
          navigate('/mainpg');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetCard}>
        <h2>Reset Your Password</h2>
        
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
        
        <form onSubmit={handleResetPassword}>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.resetButton}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
        
        <p className={styles.backLink}>
          <span onClick={() => navigate('/')} className={styles.linkText}>
            Back to Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
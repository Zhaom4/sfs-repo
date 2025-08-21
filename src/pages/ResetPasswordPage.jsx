import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingLink, setValidatingLink] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    strength = strength - 1;
    return { strength, checks };
  };

  useEffect(() => {
    const { strength } = validatePassword(newPassword);
    setPasswordStrength(strength);
  }, [newPassword]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Search:', window.location.search);

        // Get URL parameters from both hash and search
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);

        // Collect all possible auth parameters
        const authParams = {
          // PKCE code
          code: searchParams.get('code'),
          
          // Token hash format
          token_hash: hashParams.get('token_hash') || searchParams.get('token_hash'),
          
          // Legacy format
          access_token: hashParams.get('access_token') || searchParams.get('access_token'),
          refresh_token: hashParams.get('refresh_token') || searchParams.get('refresh_token'),
          
          // Common parameters
          type: hashParams.get('type') || searchParams.get('type'),
          error: hashParams.get('error') || searchParams.get('error'),
          error_description: hashParams.get('error_description') || searchParams.get('error_description')
        };

        const debugData = {
          url: window.location.href,
          hash: window.location.hash,
          search: window.location.search,
          authParams: authParams,
          supabaseSession: null
        };

        console.log('Auth params found:', authParams);

        // Check for errors first
        if (authParams.error) {
          setError(`Authentication error: ${authParams.error_description || authParams.error}`);
          setDebugInfo(JSON.stringify(debugData, null, 2));
          return;
        }

        // Let Supabase automatically handle the callback
        // This will process any auth fragments/parameters in the URL
        await new Promise(resolve => setTimeout(resolve, 1000)); // Give Supabase time to process

        // Check if we now have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        debugData.supabaseSession = {
          hasSession: !!sessionData.session,
          user: sessionData.session?.user?.email || null,
          error: sessionError?.message || null
        };

        setDebugInfo(JSON.stringify(debugData, null, 2));

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(`Session error: ${sessionError.message}`);
        } else if (sessionData.session?.user) {
          console.log('✅ User authenticated successfully:', sessionData.session.user.email);
          setMessage('Reset link verified! You can now set your new password.');
        } else {
          // If no session but we have auth parameters, try manual verification
          if (authParams.token_hash && authParams.type === 'recovery') {
            console.log('Attempting manual token verification...');
            
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: authParams.token_hash,
              type: 'recovery'
            });

            if (error) {
              console.error('Manual verification failed:', error);
              setError(`Verification failed: ${error.message}`);
            } else {
              console.log('✅ Manual verification successful');
              setMessage('Reset link verified! You can now set your new password.');
            }
          } else if (authParams.access_token && authParams.refresh_token) {
            console.log('Attempting manual session setup...');
            
            const { error } = await supabase.auth.setSession({
              access_token: authParams.access_token,
              refresh_token: authParams.refresh_token
            });

            if (error) {
              console.error('Manual session setup failed:', error);
              setError(`Session setup failed: ${error.message}`);
            } else {
              console.log('✅ Manual session setup successful');
              setMessage('Reset link verified! You can now set your new password.');
            }
          } else {
            console.log('❌ No valid auth parameters found');
            setError('Invalid reset link. Please request a new password reset.');
          }
        }

      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(`Authentication failed: ${err.message}`);
      } finally {
        setValidatingLink(false);
      }
    };

    // Give the page time to load, then handle auth
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, []);

  const getPasswordStrengthText = () => {
    console.log(passwordStrength)
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength] || 'Very Weak';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    return colors[passwordStrength] || '#ef4444';
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Please choose a stronger password');
      setLoading(false);
      return;
    }

    try {
      console.log('Updating password...');
      
      // Double-check we have a valid session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user:', userError);
        setError('Session expired. Please request a new reset link.');
        return;
      }

      console.log('Updating password for user:', user.email);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update failed:', error);
        setError(`Failed to update password: ${error.message}`);
      } else {
        console.log('✅ Password updated successfully');
        setMessage('Password updated successfully! Redirecting...');
        setTimeout(() => {
          navigate('/mainpg');
        }, 2000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = async () => {
    const email = prompt('Enter your email address:');
    if (!email) return;

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setError(`Failed to send email: ${error.message}`);
      } else {
        setMessage('New reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validatingLink) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <h3>Verifying reset link...</h3>
          <p>Please wait while we process your password reset request.</p>
          
          
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.resetCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Shield size={32} className={styles.headerIcon} />
          </div>
          <h1>Reset Your Password</h1>
          <p>Choose a strong password to secure your account</p>
        </div>
        
        {/* Messages */}
        {message && (
          <div className={styles.successMessage}>
            <CheckCircle size={20} />
            <span>{message}</span>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={20} />
            <div>
              <div>{error}</div>
              <button 
                onClick={handleRequestNewLink}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem'
                }}
              >
                Request a new reset link
              </button>
            </div>
          </div>
        )}

        {/* Debug info */}
        {/* {process.env.NODE_ENV === 'development' && (
          <details style={{ marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#666' }}>Debug Info</summary>
            <pre style={{ fontSize: '0.7rem', background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
              {debugInfo}
            </pre>
          </details>
        )} */}
        
        {/* Form - only show if we have success message */}
        {message && !error && (
          <form onSubmit={handleResetPassword} className={styles.form}>
            {/* New Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">
                <Lock size={16} />
                New Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className={newPassword ? styles.hasValue : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength */}
              {newPassword && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBar}>
                    <div 
                      className={styles.strengthFill}
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span 
                    className={styles.strengthText}
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">
                <Lock size={16} />
                Confirm New Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className={confirmPassword ? styles.hasValue : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.eyeButton}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Match indicator */}
              {confirmPassword && (
                <div className={styles.matchIndicator}>
                  {newPassword === confirmPassword ? (
                    <span className={styles.match}>
                      <CheckCircle size={16} />
                      Passwords match
                    </span>
                  ) : (
                    <span className={styles.noMatch}>
                      <AlertCircle size={16} />
                      Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Requirements */}
            <div className={styles.requirements}>
              <h4>Password Requirements:</h4>
              <ul>
                <li className={newPassword.length >= 8 ? styles.met : ''}>
                  At least 8 characters long
                </li>
                <li className={/[a-z]/.test(newPassword) ? styles.met : ''}>
                  At least one lowercase letter
                </li>
                <li className={/[A-Z]/.test(newPassword) ? styles.met : ''}>
                  At least one uppercase letter
                </li>
                <li className={/\d/.test(newPassword) ? styles.met : ''}>
                  At least one number
                </li>
              </ul>
            </div>
            
            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading || passwordStrength < 3 || newPassword !== confirmPassword}
              className={styles.resetButton}
            >
              {loading ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Updating Password...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Update Password
                </>
              )}
            </button>
          </form>
        )}
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('/')} 
          className={styles.backButton}
          disabled={loading}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/mainpg`
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Please check your email for a confirmation link!');
        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
        
        // Redirect to welcome page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/mainpg`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <h2>Create your account</h2>
        
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
        
        <form onSubmit={handleSignUp}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.signupButton}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>or</span>
        </div>
        
        <button 
          onClick={handleSignInWithGoogle}
          disabled={loading}
          className={styles.googleButton}
        >
          Continue with Google
        </button>
        
        <p className={styles.signinLink}>
          Already have an account? 
          <span onClick={handleBackToSignIn} className={styles.linkText}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
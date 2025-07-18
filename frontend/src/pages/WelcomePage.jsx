import '../pages/WelcomePage.css';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextPlugin from 'gsap/TextPlugin';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function WelcomePage() {
  const words = ["Students", "Learners", "Creators", "Dreamers", "Achievers"];
  const blinkerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const textRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);

    gsap.to(blinkerRef.current, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    gsap.set(section2Ref.current, { yPercent: 100 });
    gsap.to(section2Ref.current, {
      yPercent: 0,
      ease: "ease-in",
      scrollTrigger: {
        trigger: section1Ref.current,
        start: "top top",
        end: "top bottom",
        scrub: 1,
        pin: section1Ref.current,
        pinSpacing: true,
        markers: false
      }
    });

    let masterTl = gsap.timeline({ repeat: -1 });
    words.forEach((word) => {
      let tlText = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.5 });
      tlText.to(textRef.current, {
        duration: 1,
        text: {
          value: word,
          delimiter: ""
        }
      });
      masterTl.add(tlText);
    });

    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Create or update user profile
        await createOrUpdateUserProfile(session.user);
        navigate('/mainpg');
      } else if (event === 'SIGNED_OUT') {
        // Clear any local state if needed
        setEmail('');
        setPassword('');
        setError('');
        setMessage('');
      }
    });

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await createOrUpdateUserProfile(session.user);
        navigate('/mainpg');
      }
    };
    checkUser();

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      masterTl.kill();
      subscription.unsubscribe();
    };
  }, [navigate]);

  const createOrUpdateUserProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'id' 
        });

      if (error) {
        console.error('Error creating/updating user profile:', error);
      }
    } catch (err) {
      console.error('Error in createOrUpdateUserProfile:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
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

  const handleGoogleLogin = async () => {
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

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section ref={section1Ref} className='section main-content'>
        <div className='left'>
          <div className='t'>
            <div className="title t1">Students for</div>
            <div className="title students-interactive">
              <span ref={textRef}></span>
              <div className='blinker' ref={blinkerRef}>_</div>
            </div>
            <p className='desc'>Empowering the next generation of learners.</p>
          </div>
        </div>

        <div className='right'>
          <div className="signup-container">
            <div className="signup-card">
              <h2>Welcome back!</h2>
              
              {message && (
                <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                  {message}
                </div>
              )}
              
              {error && (
                <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '4px' }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email"
                  required 
                />
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required 
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              
              <button 
                onClick={handleForgotPassword} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'blue', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}
                disabled={loading}
              >
                Forgot your password?
              </button>
              
              <button 
                onClick={handleGoogleLogin} 
                style={{ marginTop: '1rem' }}
                disabled={loading}
              >
                Sign in with Google
              </button>
              
              <p className="signin-link">
                Don't have an account? 
                <span 
                  onClick={handleSignupRedirect} 
                  style={{ color: 'blue', cursor: 'pointer', marginLeft: '0.5rem' }}
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="scroll-down-stack">
          <svg className="chevron" viewBox="0 0 24 24">
            <path d="M6 8l6 6 6-6" fill="none" stroke="#202d7d" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg className="chevron delay1" viewBox="0 0 24 24">
            <path d="M6 8l6 6 6-6" fill="none" stroke="#202d7d" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </section>

      <section ref={section2Ref} className='section about-us'>
        <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
          {/* Optional additional content */}
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
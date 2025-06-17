import '../pages/WelcomePage.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

function WelcomePage() {
  const words = ["Students", "Learners", "Creators", "Dreamers", "Achievers"];
  const blinkerRef = useRef(null);
  const section1Ref = useRef(null)
  const section2Ref = useRef(null);
  const textRef = useRef(null);
  
  useEffect(() => {
    // Initialize Lenis
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
    
    // Blinking cursor animation
    gsap.to(blinkerRef.current, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
    
    // Set initial position for section 2
    gsap.set(section2Ref.current, { yPercent: 100 });
    
    // Create the overtake animation
    gsap.to(section2Ref.current, {
      yPercent: 0,
      ease: "ease-in",
      scrollTrigger: {
        trigger: section1Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: section1Ref.current,
        pinSpacing: false
      }
    });
    
    // Typewriter effect
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
    
    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      masterTl.kill();
    };
  }, []);
  
  return (
    <>
      <section ref={section1Ref} className='section main-content'>
        <div className='left'>
          <div className='t'>
            <div className="title t1">
              Students for
            </div>
            <div className="title students-interactive">
              <span ref={textRef}></span>
              <div className='blinker' ref={blinkerRef}>_</div>
            </div>
            <p className='desc'>
              plural noun: authorizations; plural noun: authorisations
              "Horowitz handed him the authorization signed by Evans"
            </p>
          </div>
        </div>
        
        <div className='right'>
          <div className="signup-container">
            <div className="signup-card">
              <h2>Welcome back!</h2>
              <form>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="you@example.com" required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" required />

                <button className="sign-in-button" type="submit">Sign in</button>
              </form>
              <p className="signin-link">Don't have an account? <a href="#">Sign up</a></p>
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
          
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
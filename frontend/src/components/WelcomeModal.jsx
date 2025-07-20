// Create: src/components/WelcomeModal.jsx

import React, { useEffect, useState } from 'react';
import { X, BookOpen, Heart, TrendingUp } from 'lucide-react';

const WelcomeModal = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  enrolledCount = 0, 
  favoritesCount = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '480px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            color: '#6b7280'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X size={20} />
        </button>

        {/* Welcome Content */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* Greeting */}
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontSize: '24px'
          }}>
            👋
          </div>

          <h2 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#1f2937',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back, {userProfile?.display_name || userProfile?.full_name || 'Student'}!
          </h2>

          <p style={{
            margin: '0 0 2rem 0',
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Enrolled Courses */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto'
            }}>
              <BookOpen size={20} color="white" />
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              {enrolledCount}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Enrolled Courses
            </div>
          </div>

          {/* Favorites */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto'
            }}>
              <Heart size={20} color="white" />
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              {favoritesCount}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Favorite Courses
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              minWidth: '140px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <TrendingUp size={16} />
            Continue Learning
          </button>
        </div>

        {/* Don't show again option */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            cursor: 'pointer'
          }}>
            <input 
              type="checkbox" 
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.setItem('hideWelcomeModal', 'true');
                }
              }}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#667eea'
              }}
            />
            Don't show this welcome message again
          </label>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
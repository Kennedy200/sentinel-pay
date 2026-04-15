import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight, FileText, ChevronRight } from 'lucide-react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add glassmorphism effect to navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile side drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.headerWrapper}>
      {/* --- NAVIGATION BAR --- */}
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          
          {/* Sleek Logo */}
          <div className={styles.logoGroup}>
            <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V13C3 18.55 6.84 23.74 12 25C17.16 23.74 21 18.55 21 13V7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
            </svg>
            <div className={styles.logoText}>
              Sentinel<span className={styles.logoAccent}> Pay</span>
            </div>
          </div>

          {/* Desktop Links with Pill/Oval Hover Effect */}
          <div className={styles.desktopLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How it Works</a>
            <a href="#security" className={styles.navLink}>Security</a>
          </div>

          {/* Desktop Actions */}
          <div className={styles.desktopActions}>
            <Link to="/login" className={styles.loginBtn}>Log In</Link>
          </div>

          {/* Mobile Menu Toggle (Hamburger) */}
          <button className={styles.hamburgerBtn} onClick={toggleMobileMenu} aria-label="Open menu">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* --- SLEEK MOBILE SIDE DRAWER (80% Width) --- */}
      <div 
        className={`${styles.mobileBackdrop} ${isMobileMenuOpen ? styles.mobileBackdropOpen : ''}`}
        onClick={toggleMobileMenu}
      ></div>

      <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.logoGroup}>
            <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V13C3 18.55 6.84 23.74 12 25C17.16 23.74 21 18.55 21 13V7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
            </svg>
            <div className={styles.logoText}>Sentinel</div>
          </div>
          <button className={styles.closeDrawerBtn} onClick={toggleMobileMenu} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        {/* Top Section: Links */}
        <div className={styles.mobileNavLinks}>
          <a href="#features" onClick={toggleMobileMenu}>
            Features <ChevronRight size={18} className={styles.chevron} />
          </a>
          <a href="#how-it-works" onClick={toggleMobileMenu}>
            How it Works <ChevronRight size={18} className={styles.chevron} />
          </a>
          <a href="#security" onClick={toggleMobileMenu}>
            Security <ChevronRight size={18} className={styles.chevron} />
          </a>
        </div>
        
        {/* Bottom Section: Auth Links */}
        <div className={styles.mobileActions}>
          <Link to="/signup" className={styles.signUpBtnMobile} onClick={toggleMobileMenu}>
            Get Started
          </Link>
          <Link to="/login" className={styles.loginBtnMobile} onClick={toggleMobileMenu}>
            Log In
          </Link>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <header className={styles.heroSection}>
        <div className={styles.backgroundGlow}></div>

        <div className={styles.heroContainer}>
          {/* Left Content */}
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Shield size={16} className={styles.badgeIcon} />
              <span>Next-Gen Fraud Protection</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Behavioral AI that <br />
              <span className={styles.titleHighlight}>protects your payments.</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              Sentinel-Pay learns your unique spending "DNA" from your transaction 
              history to identify and stop fraudulent transfers in under 100ms.
            </p>
            
            <div className={styles.heroButtons}>
              <Link to="/signup" className={styles.primaryHeroBtn}>
                Get Started <ArrowRight size={18} className={styles.arrowIcon} />
              </Link>
              <Link to="/docs" className={styles.secondaryHeroBtn}>
                <FileText size={18} /> Read Documentation
              </Link>
            </div>
            
            <div className={styles.trustIndicators}>
              <p>Trusted by modern fintech security teams</p>
              <div className={styles.stats}>
                <span><strong>99.9%</strong> Accuracy</span>
                <span className={styles.dot}>•</span>
                <span><strong>&lt;100ms</strong> Latency</span>
              </div>
            </div>
          </div>

          {/* Right Content / Abstract Visual */}
          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.cardHeader}>
                <div className={styles.dotGroup}>
                  <span className={styles.macDot} style={{ backgroundColor: '#ff5f56' }}></span>
                  <span className={styles.macDot} style={{ backgroundColor: '#ffbd2e' }}></span>
                  <span className={styles.macDot} style={{ backgroundColor: '#27c93f' }}></span>
                </div>
                <span className={styles.cardTitle}>AI Analysis Complete</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
                
                <div className={styles.analysisBox}>
                  <div className={styles.analysisRow}>
                    <span>Amount Deviation</span>
                    <span className={styles.riskHigh}>High Risk</span>
                  </div>
                  <div className={styles.analysisRow}>
                    <span>Time Anomaly</span>
                    <span className={styles.riskMedium}>Medium Risk</span>
                  </div>
                  <div className={styles.analysisRow}>
                    <span>Device Trust</span>
                    <span className={styles.riskLow}>Safe</span>
                  </div>
                </div>

                <div className={styles.decisionBox}>
                  <strong>Status:</strong> <span className={styles.blockedText}>Transaction Blocked</span>
                </div>
              </div>
            </div>
            <div className={`${styles.floatingElement} ${styles.floatOne}`}></div>
            <div className={`${styles.floatingElement} ${styles.floatTwo}`}></div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
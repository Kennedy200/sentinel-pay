import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.footerTop}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.logoGroup}>
              <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V13C3 18.55 6.84 23.74 12 25C17.16 23.74 21 18.55 21 13V7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
              </svg>
              <div className={styles.logoText}>Sentinel<span>Pay</span></div>
            </div>
            <p className={styles.brandDesc}>
              Next-generation behavioral AI fraud detection for Nigerian digital payment platforms. 
              Built for speed, accuracy, and transparency.
            </p>
            <div className={styles.socialLinks}>
              {/* Twitter / X SVG */}
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              {/* GitHub SVG */}
              <a href="#" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className={styles.linkGroup}>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#security">Security Architecture</a>
            <a href="#">API Documentation</a>
          </div>

          <div className={styles.linkGroup}>
            <h4>Project</h4>
            <a href="#">Methodology</a>
            <a href="#">ML Models</a>
            <a href="#">GitHub Repo</a>
            <a href="#">Final Year Thesis</a>
          </div>

          <div className={styles.linkGroup}>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Data Handling</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2026 Sentinel-Pay. Final Year Project. All rights reserved.</p>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            System Operational
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
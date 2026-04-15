import React, { useEffect, useRef } from 'react';
import { Fingerprint, Cpu, Lock, UploadCloud, Activity, CheckCircle } from 'lucide-react';
import styles from './About.module.css';

const About: React.FC = () => {
  // Simple intersection observer for scroll animations
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(`.${styles.animateOnScroll}`);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.aboutWrapper} id="features" ref={sectionRef}>
      
      {/* --- THE PROBLEM VS SOLUTION (ABOUT) --- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.textCenter} ${styles.animateOnScroll}`}>
            <span className={styles.badge}>Why Sentinel-Pay?</span>
            <h2 className={styles.sectionTitle}>Traditional rule-based systems are dead.</h2>
            <p className={styles.sectionSubtitle}>
              Current fraud detection blocks 20% of legitimate transactions while missing sophisticated 
              SIM-swap and mule account attacks. We fixed this using personalized AI.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={`${styles.featureCard} ${styles.animateOnScroll}`}>
              <div className={styles.iconBox}><Fingerprint size={24} /></div>
              <h3>Behavioral DNA</h3>
              <p>We don't just look at the transaction. We analyze your unique spending habits, typical merchants, and activity times.</p>
            </div>
            <div className={`${styles.featureCard} ${styles.animateOnScroll}`}>
              <div className={styles.iconBox}><Cpu size={24} /></div>
              <h3>Ensemble ML Engine</h3>
              <p>Random Forest, XGBoost, and Neural Networks work simultaneously to cross-verify every transaction in under 100ms.</p>
            </div>
            <div className={`${styles.featureCard} ${styles.animateOnScroll}`}>
              <div className={styles.iconBox}><Activity size={24} /></div>
              <h3>Explainable AI (SHAP)</h3>
              <p>No more "Black Box" algorithms. If a transaction is blocked, our AI tells the fraud analyst exactly why.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className={styles.graySection} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            <div className={`${styles.splitText} ${styles.animateOnScroll}`}>
              <span className={styles.badge}>How It Works</span>
              <h2 className={styles.sectionTitle}>From PDF to Iron-Clad Security in seconds.</h2>
              
              <div className={styles.stepList}>
                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Upload Transaction History</h4>
                    <p>Provide your Bank Transaction History (CSV/PDF). Our system extracts your data locally and securely.</p>
                  </div>
                </div>
                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>AI Builds Your Profile</h4>
                    <p>The Isolation Forest algorithm maps out your baseline "normal" behavior in our Redis cache.</p>
                  </div>
                </div>
                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Real-Time Protection</h4>
                    <p>Any future simulated transfer is instantly compared against your DNA. Anomalies are blocked immediately.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.splitVisual} ${styles.animateOnScroll}`}>
              <div className={styles.uploadMockup}>
                <UploadCloud size={48} className={styles.uploadIcon} />
                <h3>Drag & Drop Bank Transaction History</h3>
                <p>Supports .CSV, .XLSX, and .PDF formats</p>
                <button className={styles.browseBtn}>Browse Files</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECURITY SECTION --- */}
      <section className={styles.section} id="security">
        <div className={styles.container}>
          <div className={`${styles.securityBox} ${styles.animateOnScroll}`}>
            <div className={styles.securityHeader}>
              <Lock size={32} className={styles.lockIcon} />
              <h2>Bank-Grade Security Architecture</h2>
            </div>
            <div className={styles.securityGrid}>
              <div className={styles.secItem}>
                <CheckCircle size={20} className={styles.checkIcon} />
                <span>Zero raw passwords stored. We only store behavioral hashes.</span>
              </div>
              <div className={styles.secItem}>
                <CheckCircle size={20} className={styles.checkIcon} />
                <span>End-to-End Encryption (AES-256) for all uploaded documents.</span>
              </div>
              <div className={styles.secItem}>
                <CheckCircle size={20} className={styles.checkIcon} />
                <span>Data gets wiped immediately after profile generation (Optional).</span>
              </div>
              <div className={styles.secItem}>
                <CheckCircle size={20} className={styles.checkIcon} />
                <span>Regulatory Compliant Explainable AI for auditing.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
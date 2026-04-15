import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, Key, Terminal,
  ArrowLeft, CheckCircle2, PanelLeftClose, PanelLeftOpen, 
  X, Menu, Laptop, Cpu, Lock, Zap, FileJson, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Docs.module.css';

type DocSection = 'overview' | 'user-guide' | 'auth-keys' | 'api-reference';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile drawer

  // Scroll to top when section changes
  useEffect(() => {
    const mainContent = document.getElementById('docs-main');
    if (mainContent) mainContent.scrollTo(0, 0);
  }, [activeSection]);

  return (
    <div className={styles.docsContainer}>
      
      {/* Subtle Background Animation */}
      <div className={styles.docsBg}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
      </div>

      {/* --- TOP NAVBAR --- */}
      <nav className={styles.docsNav}>
        <div className={styles.navLeft}>
          <button className={styles.mobileHamburger} onClick={() => setIsMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={18} /> <span>Home</span>
          </Link>
          <div className={styles.divider}></div>
          <div className={styles.logoGroup}>
            <ShieldCheck color="#0984e3" size={22} />
            <span className={styles.logoText}>Sentinel<span>Docs</span></span>
          </div>
        </div>
        <div className={styles.navRight}>
          <button className={styles.devLoginBtn} onClick={() => window.location.href='/login'}>Developer Login</button>
        </div>
      </nav>

      <div className={styles.docsLayout}>
        
        {/* --- SIDEBAR (Desktop & Mobile Drawer) --- */}
        <AnimatePresence>
          {(isMobileOpen || !isCollapsed || window.innerWidth > 900) && (
            <motion.aside 
              initial={window.innerWidth <= 900 ? { x: -300 } : false}
              animate={{ 
                x: 0, 
                width: isCollapsed ? 80 : 280 
              }}
              exit={window.innerWidth <= 900 ? { x: -300 } : {}}
              className={`${styles.sidebar} ${isMobileOpen ? styles.mobileSidebarActive : ''}`}
            >
              <div className={styles.sidebarHeader}>
                <h4 className={styles.sidebarLabel}>{isCollapsed ? 'Docs' : 'Documentation'}</h4>
                <button className={styles.mobileClose} onClick={() => setIsMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.sidebarContent}>
                <div className={styles.navGroup}>
                  <p className={styles.groupTitle}>Getting Started</p>
                  <button className={`${styles.navLink} ${activeSection === 'overview' ? styles.active : ''}`} onClick={() => {setActiveSection('overview'); setIsMobileOpen(false);}}>
                    <Book size={18} /> {!isCollapsed && "Overview"}
                  </button>
                  <button className={`${styles.navLink} ${activeSection === 'user-guide' ? styles.active : ''}`} onClick={() => {setActiveSection('user-guide'); setIsMobileOpen(false);}}>
                    <Laptop size={18} /> {!isCollapsed && "App User Guide"}
                  </button>
                </div>

                <div className={styles.navGroup}>
                  <p className={styles.groupTitle}>Integration</p>
                  <button className={`${styles.navLink} ${activeSection === 'auth-keys' ? styles.active : ''}`} onClick={() => {setActiveSection('auth-keys'); setIsMobileOpen(false);}}>
                    <Key size={18} /> {!isCollapsed && "Auth & API Keys"}
                  </button>
                  <button className={`${styles.navLink} ${activeSection === 'api-reference' ? styles.active : ''}`} onClick={() => {setActiveSection('api-reference'); setIsMobileOpen(false);}}>
                    <Terminal size={18} /> {!isCollapsed && "API Reference"}
                  </button>
                </div>
              </div>

              <button className={styles.desktopToggle} onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                {!isCollapsed && <span>Collapse Sidebar</span>}
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* --- MAIN CONTENT --- */}
        <main className={styles.mainContent} id="docs-main">
          <div className={styles.contentInner}>
            
            {/* 1. OVERVIEW */}
            {activeSection === 'overview' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.prose}>
                <span className={styles.badge}>Introduction</span>
                <h1 className={styles.mainTitle}>Sentinel Engine <span>v1.0</span></h1>
                <p className={styles.leadText}>The next-generation behavioral AI middleware for secure Nigerian digital payments.</p>
                
                <div className={styles.featureGrid}>
                   <div className={styles.featCard}><Cpu size={20} /> <h4>Triple Ensemble</h4><p>XGBoost, Random Forest, and Isolation Forest working in sync.</p></div>
                   <div className={styles.featCard}><Zap size={20} /> <h4>Sub-100ms</h4><p>High-speed inference designed for real-time payment gateways.</p></div>
                   <div className={styles.featCard}><Lock size={20} /> <h4>DNA Profiling</h4><p>Personalized spending identity for every individual user.</p></div>
                </div>

                <h3>Architecture Overview</h3>
                <p>Sentinel-Pay works as a security layer between the <b>Transaction Request</b> and the <b>Payment Execution</b>. By analyzing 500,000+ global records alongside localized user history, it provides a "Confidence Score" for every Naira moved.</p>
                
                <div className={styles.callout}>
                  <Info size={20} color="#0984e3" />
                  <p><b>Explainable AI (SHAP):</b> Every block comes with a reason. We use SHAP values to decode the AI's "Black Box" into human-readable security insights.</p>
                </div>
              </motion.section>
            )}

            {/* 2. USER GUIDE */}
            {activeSection === 'user-guide' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.prose}>
                <span className={styles.badge}>Web Application</span>
                <h1 className={styles.mainTitle}>Navigating the Dashboard</h1>
                
                <h3>Phase 1: Behavioral Training</h3>
                <p>To begin, Ayo (the user) must establish their identity. Navigate to <b>Behavioral DNA</b> and upload a recent bank or fintech statement (PDF/CSV).</p>
                
                <div className={styles.stepBox}>
                   <div className={styles.step}><CheckCircle2 size={16} /> <span><b>Extraction:</b> Our parser reads amounts, times, and merchants.</span></div>
                   <div className={styles.step}><CheckCircle2 size={16} /> <span><b>Training:</b> The system fits your specific Isolation Forest model.</span></div>
                </div>

                <h3>Phase 2: The Security Simulator</h3>
                <p>The <b>Simulator</b> allows you to stress-test your AI. Enter a transaction value and merchant to see if the AI detects the pattern as "Safe" or "Threat."</p>
                <div className={styles.callout} style={{ borderColor: '#f59e0b' }}>
                  <AlertTriangle size={20} color="#f59e0b" />
                  <p><b>Learning Loop:</b> If Ayo blocks himself, he can click "I Authorized This" to manually update his AI baseline in real-time.</p>
                </div>
              </motion.section>
            )}

            {/* 3. AUTH & KEYS */}
            {activeSection === 'auth-keys' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.prose}>
                <span className={styles.badge}>Developer Hub</span>
                <h1 className={styles.mainTitle}>API Authentication</h1>
                <p>Sentinel uses Secret Keys to authenticate requests. These keys follow the <code>sp_live_</code> prefix format.</p>
                
                <h3>Generating a Key</h3>
                <ol>
                  <li>Navigate to the <b>Developer Hub</b> in the sidebar.</li>
                  <li>Click <b>Generate New Secret Key</b>.</li>
                  <li>Copy the key immediately. We hash it for security, so it cannot be recovered if lost.</li>
                </ol>

                <div className={styles.codeBlock}>
                  <div className={styles.codeHead}><FileJson size={14} /> Request Header</div>
                  <pre><code>X-Sentinel-Key: sp_live_your_secret_key_here</code></pre>
                </div>
              </motion.section>
            )}

            {/* 4. API REFERENCE */}
            {activeSection === 'api-reference' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.prose}>
                <span className={styles.badge}>Endpoints</span>
                <h1 className={styles.mainTitle}>Public API Reference</h1>
                
                <div className={styles.endpoint}>
                   <span className={styles.method}>POST</span>
                   <code>/api/v1/public/analyze/</code>
                </div>

                <h3>Python Integration</h3>
                <p>Example of calling the Sentinel Engine from a standard Python backend:</p>

                <div className={styles.codeBlock}>
                  <div className={styles.codeHead}><Terminal size={14} /> sentinel_test.py</div>
                  <pre><code>{`import requests

url = "https://api.sentinel-pay.com/api/v1/public/analyze/"
headers = { "X-Sentinel-Key": "sp_live_xxxxxx" }

payload = {
    "amount": 50000,
    "category": "crypto",
    "hour": 3,  # 3:00 AM
    "recipient": "Exchange Wallet"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}</code></pre>
                </div>

                <h3>Response Schema</h3>
                <div className={styles.codeBlock}>
                  <pre><code>{`{
  "status": "blocked",
  "fraud_probability": 89.4,
  "analyzed_by": "Sentinel Triple-Ensemble",
  "request_id": "a1b2c3d4"
}`}</code></pre>
                </div>
              </motion.section>
            )}

          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.backdrop} onClick={() => setIsMobileOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

// Reusable local icon
const ShieldCheck = ({ size, color }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
const AlertTriangle = ({ size, color }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default Docs;
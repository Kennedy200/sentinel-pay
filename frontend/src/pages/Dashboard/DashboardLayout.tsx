import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Fingerprint, Zap, History, Settings, LogOut, ShieldCheck, 
  Menu, Bell, User, PanelLeftClose, PanelLeftOpen, X, ShieldAlert, Info, Check, 
  Clock, Shield, ShieldQuestion, Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styles from './Dashboard.module.css';

const infoSlides = [
  "Banks lose ₦12 Billion annually to fraud.",
  "Ensemble ML verifies in <100ms.",
  "Explainable AI (SHAP) is live.",
  "DNA profiling is active.",
  "Sentinel-Pay: Security Reimagined."
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchNotifs, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [uRes, nRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/dashboard/summary/', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:8000/api/v1/notifications/', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUserData(uRes.data);
      setNotifications(nRes.data);
    } catch (e) { }
  };

  const fetchNotifs = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/api/v1/notifications/', { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data);
    } catch (e) { }
  };

  const toggleNotifs = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://127.0.0.1:8000/api/v1/notifications/', {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(notifications.map(n => ({...n, is_read: true})));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % infoSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Behavioral DNA', path: '/dashboard/dna', icon: <Fingerprint size={20} /> },
    { name: 'Simulator', path: '/dashboard/simulator', icon: <Zap size={20} /> },
    { name: 'Risk Logs', path: '/dashboard/logs', icon: <History size={20} /> },
    { name: 'Developer Hub', path: '/dashboard/developer', icon: <Code2 size={20} /> },
  ];

  return (
    <div className={styles.container}>
      <motion.aside initial={false} animate={{ width: isCollapsed ? 80 : 260, x: typeof window !== 'undefined' && window.innerWidth <= 900 ? (isMobileOpen ? 0 : -260) : 0 }} className={`${styles.sidebar} ${isMobileOpen ? styles.mobileSidebarOpen : ''}`}>
        <div className={`${styles.sidebarHeader} ${isCollapsed ? styles.headerCentered : ''}`}>
          {!isCollapsed && <div className={styles.logoGroup}><ShieldCheck size={26} color="#0984e3"/><span className={styles.logoText}>Sentinel</span></div>}
          <button className={styles.desktopToggle} onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? <PanelLeftOpen size={22}/> : <PanelLeftClose size={22}/>}</button>
          <button className={styles.mobileCloseBtn} onClick={() => setIsMobileOpen(false)}><X size={24}/></button>
        </div>
        <nav className={styles.nav}>{menuItems.map((item) => (<Link key={item.path} to={item.path} className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`} onClick={() => setIsMobileOpen(false)}><div className={styles.iconWrapper}>{item.icon}</div>{!isCollapsed && <span>{item.name}</span>}</Link>))}</nav>
        <div className={styles.sidebarFooter}><Link to="/dashboard/settings" className={styles.navItem} onClick={() => setIsMobileOpen(false)}><div className={styles.iconWrapper}><Settings size={20}/></div>{!isCollapsed && <span>Settings</span>}</Link><button onClick={() => {localStorage.clear(); navigate('/login');}} className={styles.logoutBtn}><div className={styles.iconWrapper}><LogOut size={20}/></div>{!isCollapsed && <span>Sign Out</span>}</button></div>
      </motion.aside>

      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.mobileHamburger} onClick={() => setIsMobileOpen(true)}><Menu size={24}/></button>
            <div className={styles.mobileLogo}><ShieldCheck size={22} color="#0984e3" /><span>Sentinel</span></div>
            <div className={styles.tickerContainer}><AnimatePresence mode="wait"><motion.p key={currentSlide} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -15, opacity: 0 }} className={styles.tickerText}>{infoSlides[currentSlide]}</motion.p></AnimatePresence></div>
          </div>
          <div className={styles.topBarRight}>
            <div className={`${styles.shieldStatus} ${userData?.is_active ? styles.shieldActive : styles.shieldIdle}`}>{userData?.is_active ? <Shield size={18} /> : <ShieldQuestion size={18} />}<span>{userData?.is_active ? 'Identity Verified' : 'Unverified'}</span></div>
            <div className={styles.notifWrapper} ref={notifRef}><button className={styles.notificationBtn} onClick={toggleNotifs}><Bell size={20} />{unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}</button>
                <AnimatePresence>{isNotifOpen && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={styles.notifDropdown}><div className={styles.notifHeader}><h4>Alerts</h4><span>{unreadCount} new</span></div><div className={styles.notifList}>{notifications.length > 0 ? notifications.map(n => (<div key={n.id} className={`${styles.notifItem} ${!n.is_read ? styles.unread : ''}`}><div className={`${styles.notifIcon} ${styles[n.type]}`}>{n.type==='fraud'?<ShieldAlert size={16}/>:<Info size={16}/>}</div><div className={styles.notifBody}><p className={styles.notifTitle}>{n.title}</p><p className={styles.notifMsg}>{n.message}</p></div></div>)) : <div className={styles.emptyNotifs}><Check size={24}/> All caught up</div>}</div></motion.div>)}</AnimatePresence>
            </div>
            <div className={styles.divider}></div>
            <button className={styles.profileDropdown} onClick={() => navigate('/dashboard/settings')}>
               <div className={styles.userInfo}><span className={styles.userName}>{userData ? `${userData.user_name}` : 'Syncing...'}</span></div>
               <div className={`${styles.avatarContainer} ${userData?.avatar ? styles.hasStory : ''}`}><div className={styles.avatarRing}></div><div className={styles.avatarCircle}>{userData?.avatar ? <img src={userData.avatar.startsWith('http') ? userData.avatar : `http://127.0.0.1:8000${userData.avatar}`} alt="Avatar" className={styles.avatarImg} /> : <User size={18}/>}</div></div>
            </button>
          </div>
        </header>
        <main className={styles.content}><div className={styles.contentInner}>{children}</div></main>
      </div>
      <AnimatePresence>{isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.backdrop} onClick={() => setIsMobileOpen(false)} />}</AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Camera, Save, Loader2, 
  CheckCircle2, AlertCircle, Info, X, Trash2, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'danger'>('profile');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [notify, setNotify] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'success' });
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => { if (notify.show) { const timer = setTimeout(() => setNotify({ ...notify, show: false }), 4000); return () => clearTimeout(timer); } }, [notify.show]);

  const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'success') => setNotify({ show: true, message, type });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/api/v1/user/profile/', { headers: { Authorization: `Bearer ${token}` } });
      setProfile({ firstName: res.data.first_name, lastName: res.data.last_name, email: res.data.email, avatar: res.data.avatar || '' });
    } catch (err) { showNotify("Session error", "error"); }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('first_name', profile.firstName);
    formData.append('last_name', profile.lastName);
    if (avatarFile) formData.append('avatar', avatarFile);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch('http://127.0.0.1:8000/api/v1/user/profile/', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      showNotify("Profile updated!", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) { showNotify("Update failed", "error"); } finally { setLoading(false); }
  };

  const handleResetDNA = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://127.0.0.1:8000/api/v1/dna/reset/', {}, { headers: { Authorization: `Bearer ${token}` } });
      showNotify("System Reset complete.", "info");
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (err) { showNotify("Reset failed", "error"); } finally { setLoading(false); setShowConfirmModal(false); }
  };

  return (
    <div className={styles.container}>
      {/* --- SLEEK TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {notify.show && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`${styles.toast} ${styles[notify.type]}`}>
            <div className={styles.toastContent}>{notify.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}<span>{notify.message}</span></div>
            <button onClick={() => setNotify({ ...notify, show: false })} className={styles.closeToast}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className={styles.modalOverlay}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={styles.confirmModal}>
               <div className={styles.modalIcon}><ShieldAlert size={48} color="#dc2626" /></div>
               <h2>Are you absolutely sure?</h2>
               <p>This action is irreversible. It will permanently delete your personalized AI models and all historical security logs.</p>
               <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>Keep My Data</button>
                  <button className={styles.confirmBtn} onClick={handleResetDNA} disabled={loading}>
                    {loading ? "Wiping..." : "Yes, Delete Everything"}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={styles.tabs}>
        <button className={activeTab === 'profile' ? styles.activeTab : ''} onClick={() => setActiveTab('profile')}><User size={18} /> Profile</button>
        <button className={activeTab === 'security' ? styles.activeTab : ''} onClick={() => setActiveTab('security')}><Lock size={18} /> Security</button>
        <button className={activeTab === 'danger' ? styles.activeTab : ''} onClick={() => setActiveTab('danger')} style={{color: '#dc2626'}}><ShieldAlert size={18} /> Danger Zone</button>
      </div>

      <div className={styles.contentCard}>
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.form key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleProfileUpdate}>
               <div className={styles.avatarSection}>
                 <div className={styles.avatarWrapper}>
                   <div className={styles.imageCircle}>
                     {previewUrl || profile.avatar ? (
                       <img src={previewUrl || (profile.avatar.startsWith('http') ? profile.avatar : `http://127.0.0.1:8000${profile.avatar}`)} alt="Avatar" className={styles.profileImg} />
                     ) : ( <div className={styles.initials}>{profile.firstName[0]}</div> )}
                   </div>
                   <label htmlFor="avatarInput" className={styles.editOverlay}><Camera size={20} /></label>
                   <input type="file" id="avatarInput" hidden onChange={(e) => {if(e.target.files?.[0]){setAvatarFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0]))}}} accept="image/*" />
                 </div>
                 <h3>Personal Identity</h3>
               </div>
               <div className={styles.inputGrid}>
                 <div className={styles.inputGroup}><label>First Name</label><input type="text" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} /></div>
                 <div className={styles.inputGroup}><label>Last Name</label><input type="text" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} /></div>
               </div>
               <button className={styles.saveBtn} disabled={loading}>{loading ? <Loader2 className={styles.spin} /> : "Save Changes"}</button>
            </motion.form>
          ) : activeTab === 'security' ? (
            <motion.form key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div className={styles.securityHeader}><h3>Security Update</h3><p>Manage your account password.</p></div>
               <div className={styles.inputGroup}><label>Old Password</label><input type="password" placeholder="••••••••" /></div>
               <div className={styles.inputGroup}><label>New Password</label><input type="password" placeholder="••••••••" /></div>
               <button className={styles.saveBtn}>Update Credentials</button>
            </motion.form>
          ) : (
            <motion.div key="danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.dangerZone}>
               <div className={styles.dangerHeader}>
                  <ShieldAlert size={40} color="#dc2626" />
                  <h2>System Reset Control</h2>
                  <p>Sentinel will revert to an idle state. Your Behavioral DNA will be completely wiped from the database.</p>
               </div>
               <div className={styles.dangerList}>
                  <div className={styles.dangerItem}><strong>Erase AI Models</strong><p>Wipe the personalized .joblib brain files.</p></div>
                  <div className={styles.dangerItem}><strong>Clear Simulation History</strong><p>All past risk logs will be deleted.</p></div>
               </div>
               <button onClick={() => setShowConfirmModal(true)} className={styles.deleteBtn}>
                  <Trash2 size={18}/> Wipe All Behavioral Data
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
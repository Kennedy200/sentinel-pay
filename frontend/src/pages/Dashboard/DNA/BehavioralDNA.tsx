import React, { useState, useEffect } from 'react';
import { 
  CloudUpload, CheckCircle2, AlertCircle, 
  Loader2, ShieldCheck, ArrowRight, Info,
  TrendingUp, Clock, Target, RefreshCcw, FileText, X, ShieldAlert
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styles from './BehavioralDNA.module.css';

const COLORS = ['#0984e3', '#00b894', '#fdcb6e', '#6c5ce7', '#e84393'];

const BehavioralDNA: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  // Notification State
  const [notify, setNotify] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchDNA();
  }, []);

  // Auto-hide notifications after 4 seconds
  useEffect(() => {
    if (notify.show) {
      const timer = setTimeout(() => setNotify({ ...notify, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [notify.show]);

  const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotify({ show: true, message, type });
  };

  const fetchDNA = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/api/v1/dna/stats/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.is_active) {
        setStats(res.data);
      } else {
        setStats(null);
      }
    } catch (err) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Added the missing handleFileChange function
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://127.0.0.1:8000/api/v1/dna/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showNotify("DNA profile extracted and AI training complete.", "success");
      fetchDNA(); 
    } catch (err) {
      showNotify("Analysis failed. Verify file format.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://127.0.0.1:8000/api/v1/dna/reset/', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotify("DNA Baseline Reset Successfully.", "info");
      setStats(null);
      setShowResetModal(false);
    } catch (err) {
      showNotify("Reset failed. Try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderArea}>
        <Loader2 className={styles.spin} size={40} />
        <p>Retrieving Identity DNA...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* --- SLEEK NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {notify.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`${styles.toast} ${styles[notify.type]}`}
          >
            <div className={styles.toastContent}>
                {notify.type === 'success' && <CheckCircle2 size={18} />}
                {notify.type === 'error' && <AlertCircle size={18} />}
                {notify.type === 'info' && <Info size={18} />}
                <span>{notify.message}</span>
            </div>
            <button onClick={() => setNotify({ ...notify, show: false })} className={styles.closeToast}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CUSTOM RESET MODAL --- */}
      <AnimatePresence>
        {showResetModal && (
          <div className={styles.modalOverlay}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={styles.confirmModal}>
               <ShieldAlert size={48} color="#dc2626" style={{marginBottom: '1rem'}} />
               <h2>Reset DNA Baseline?</h2>
               <p>This will permanently erase your spending patterns and AI models. Protection will be disabled until you re-train.</p>
               <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setShowResetModal(false)}>Cancel</button>
                  <button className={styles.confirmBtn} onClick={handleReset}>Yes, Reset DNA</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!stats ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.mainCard}>
            <div className={styles.shine}></div>
            <div className={styles.cardLayout}>
              <div className={styles.guideSide}>
                <div className={styles.guideHeader}><ShieldCheck size={32} color="#0984e3" /><h3>Secure Profiling</h3></div>
                <div className={styles.instructionBox}>
                  <div className={styles.instructionItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <p><strong>Upload History:</strong> OPay, PalmPay, or Bank Statements.</p>
                  </div>
                  <div className={styles.instructionItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <p><strong>Format:</strong> Ensure the file is in <b>PDF</b> or <b>Excel</b>.</p>
                  </div>
                  <div className={styles.instructionItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <p><strong>Privacy:</strong> We extract math patterns, not raw data.</p>
                  </div>
                </div>
                <div className={styles.securityBadge}><Info size={16} /><span>AES-256 Bank Grade Encryption</span></div>
              </div>

              <div className={styles.uploadSide}>
                <div className={styles.header}>
                  <h1>Train your AI</h1>
                  <p>Sentinel needs to learn your patterns before it can protect you.</p>
                </div>
                <div className={`${styles.dropZone} ${file ? styles.fileSelected : ''}`}>
                  <input type="file" id="fileUpload" className={styles.fileInput} onChange={handleFileChange} accept=".pdf,.csv,.xlsx" />
                  <label htmlFor="fileUpload" className={styles.fileLabel}>
                    <div className={styles.iconCircle}><CloudUpload size={32} /></div>
                    {file ? <div className={styles.fileDetail}><span className={styles.fileName}>{file.name}</span></div> : <div className={styles.prompt}><span>Click to browse file</span><p>Transaction PDF or CSV</p></div>}
                  </label>
                </div>
                <button className={styles.actionBtn} disabled={!file || isUploading} onClick={handleUpload}>
                  {isUploading ? <><Loader2 className={styles.spin} size={18} /> Deep Scanning...</> : <>Analyze & Build Profile <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.statsContainer}>
            <div className={styles.statsHeader}>
              <div><h1>Behavioral DNA: <span className={styles.statusText}>Active</span></h1><p>Identity baseline is protecting your digital wallet.</p></div>
              <button className={styles.resetBtn} onClick={() => setShowResetModal(true)}><RefreshCcw size={16} /> Reset Engine</button>
            </div>

            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}><TrendingUp color="#0984e3" size={24} /><div className={styles.kpiInfo}><small>Average Spend</small><h3>₦{stats.avg_amount.toLocaleString()}</h3></div></div>
              <div className={styles.kpiCard}><Target color="#00b894" size={24} /><div className={styles.kpiInfo}><small>Safe Threshold</small><h3>₦{stats.max_amount.toLocaleString()}</h3></div></div>
              <div className={styles.kpiCard}><Clock color="#6c5ce7" size={24} /><div className={styles.kpiInfo}><small>Active Slots</small><h3>{stats.active_hours.filter((h:any) => h.value > 50).length} / 24h</h3></div></div>
            </div>

            <div className={styles.chartGrid}>
              <div className={styles.chartCard}>
                <h4><Clock size={16} /> 24-Hour Activity Signature</h4>
                <div className={styles.radarWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.active_hours}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="hour" tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <Radar name="Activity" dataKey="value" stroke="#0984e3" fill="#0984e3" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h4><FileText size={16} /> Merchant Risk Profile</h4>
                <div className={styles.pieWrapper}>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={stats.merchants} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                        {stats.merchants.map((_entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.pieLegend}>
                    {stats.merchants.map((m: any, i: number) => (
                      <div key={i} className={styles.legendItem}>
                        <span style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                        <p>{m.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BehavioralDNA;
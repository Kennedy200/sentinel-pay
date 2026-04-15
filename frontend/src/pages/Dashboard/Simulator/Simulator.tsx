import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, ArrowRight, Landmark, CreditCard, Activity, 
  RefreshCcw, ShoppingBag, AlertTriangle, Check, X, CheckCircle2, AlertCircle, Info 
} from 'lucide-react';
import axios from 'axios';
import styles from './Simulator.module.css';

const banks = ["OPay Digital", "PalmPay", "Kuda Bank", "Access Bank", "UBA", "GTBank PLC", "First Bank", "Moniepoint"];
const categories = [{ id: 'transfer', name: 'Personal Transfer' }, { id: 'utility', name: 'Utility & Bills' }, { id: 'pos', name: 'POS Withdrawal' }, { id: 'betting', name: 'Gaming/Betting' }, { id: 'crypto', name: 'Crypto Exchange' }];

const Simulator: React.FC = () => {
  const [formData, setFormData] = useState({ amount: '', recipient: '', bank: banks[0], category: 'transfer' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [notify, setNotify] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'success' });

  useEffect(() => { if (notify.show) { const timer = setTimeout(() => setNotify({ ...notify, show: false }), 4000); return () => clearTimeout(timer); } }, [notify.show]);

  const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'success') => setNotify({ show: true, message, type });

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://127.0.0.1:8000/api/v1/analyze/', { ...formData, amount: parseFloat(formData.amount) }, { headers: { 'Authorization': `Bearer ${token}` } });
      setTimeout(() => { setResult(response.data); setIsAnalyzing(false); }, 2500);
    } catch (err) { setIsAnalyzing(false); showNotify("Build DNA profile first.", "error"); }
  };

  const handleManualAuthorize = async () => {
    if (!result?.transaction_id) return;
    setIsLearning(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://127.0.0.1:8000/api/v1/verify-transaction/', { transaction_id: result.transaction_id }, { headers: { Authorization: `Bearer ${token}` } });
      setResult({ ...result, status: 'approved', fraud_score: 0.1 });
      showNotify("AI updated. Pattern marked as SAFE.", "success");
    } catch (err) { showNotify("Auth failed.", "error"); } finally { setIsLearning(false); }
  };

  const getVerdict = (status: string) => {
    if (status === 'approved') return { icon: <ShieldCheck size={64} />, class: styles.resApproved, label: 'APPROVED' };
    if (status === 'flagged') return { icon: <AlertTriangle size={64} />, class: styles.resFlagged, label: 'FLAGGED' };
    return { icon: <ShieldAlert size={64} />, class: styles.resBlocked, label: 'BLOCKED' };
  };

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>{notify.show && (<motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`${styles.toast} ${styles[notify.type]}`}><div className={styles.toastContent}>{notify.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}<span>{notify.message}</span></div><button onClick={() => setNotify({ ...notify, show: false })} className={styles.closeToast}><X size={16} /></button></motion.div>)}</AnimatePresence>

      <div className={styles.centerContainer}>
        <div className={styles.header}><h1>Transaction Simulator</h1><p>Ensemble AI cross-references transfers against your DNA.</p></div>
        <div className={styles.mainCard}>
          <AnimatePresence mode="wait">
            {!isAnalyzing && !result && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.formContainer}>
                <form onSubmit={handleSimulate}>
                  <div className={styles.inputGroup}><label><CreditCard size={16} /> Amount (₦)</label><input type="number" placeholder="e.g. 5,000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required /></div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}><label><ShoppingBag size={16} /> Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
                    <div className={styles.inputGroup}><label><Landmark size={16} /> Destination Bank</label><select value={formData.bank} onChange={(e) => setFormData({...formData, bank: e.target.value})}>{banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}</select></div>
                  </div>
                  <div className={styles.inputGroup}><label><Landmark size={16} /> Recipient Name</label><input type="text" placeholder="Account name" value={formData.recipient} onChange={(e) => setFormData({...formData, recipient: e.target.value})} required /></div>
                  <button type="submit" className={styles.submitBtn}>Authorize Transfer <ArrowRight size={18} /></button>
                </form>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.scanningContainer}>
                <div className={styles.flashContainer}><motion.div className={styles.flashCircle} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} /><motion.div className={styles.checkFlash} initial={{ x: -100, opacity: 0 }} animate={{ x: 100, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}><Check size={40} color="#0984e3" strokeWidth={3} /></motion.div><ShieldCheck size={60} className={styles.staticShield} /></div>
                <h3>Sentinel AI is Validating</h3><p className={styles.loadingSub}>Analyzing security vectors...</p>
              </motion.div>
            )}

            {result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`${styles.resultContainer} ${getVerdict(result.status).class}`}>
                <div className={styles.verdictIcon}>{getVerdict(result.status).icon}</div>
                <h2>Transaction {getVerdict(result.status).label}</h2>
                <div className={styles.scorePill}>AI Risk Probability: <strong>{(result.fraud_score * 100).toFixed(0)}%</strong></div>
                <div className={styles.explanationCard}>
                  <h4><Activity size={14} /> SECURITY DIAGNOSTIC REPORT</h4>
                  <ul>{result.shap_explanations.map((ex: any, i: number) => (<li key={i}><span className={styles.impactBadge} data-impact={ex.impact}>{ex.impact}</span><span className={styles.reasonText}>{ex.reason}</span></li>))}</ul>
                </div>
                <div className={styles.resultActions}>
                   <button onClick={() => setResult(null)} className={styles.resetBtn}><RefreshCcw size={16} /> New Simulation</button>
                   {result.status !== 'approved' && (<button onClick={handleManualAuthorize} className={styles.authorizeBtn} disabled={isLearning}>{isLearning ? "Learning..." : "I Authorized This"}</button>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
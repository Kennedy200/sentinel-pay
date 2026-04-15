import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Zap, Activity, ArrowRight, 
  Lock, ShieldCheck, Loader2, TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './Overview.module.css';

const RISK_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/api/v1/dashboard/summary/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) { console.error("Summary fetch failed"); } finally { setLoading(false); }
    };
    fetchSummary();
  }, []);

  // --- MOCK DATA FOR THE CHARTS ---
  const trendData = [
    { day: 'Mon', attempts: 4 }, { day: 'Tue', attempts: 3 },
    { day: 'Wed', attempts: 8 }, { day: 'Thu', attempts: 5 },
    { day: 'Fri', attempts: 12 }, { day: 'Sat', attempts: 7 },
    { day: 'Sun', attempts: 15 },
  ];

  const riskComposition = [
    { name: 'Low Risk', value: 70 },
    { name: 'Medium Risk', value: 20 },
    { name: 'High Risk', value: 10 },
  ];

  if (loading) return <div className={styles.loader}><Loader2 className={styles.spin} size={40} color="#0984e3" /></div>;

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBar}>
        <div>
          <h1>Welcome, {data?.user_name || 'User'}</h1>
          <p>Sentinel is currently <b>{data?.is_active ? 'Active' : 'Idle'}</b>. System health is optimal.</p>
        </div>
        {data?.is_active && <div className={styles.statusBadge}><div className={styles.pulseDot}></div>Secure Protection Enabled</div>}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}><div className={`${styles.iconBox} ${styles.blue}`}><Activity size={24} /></div><div className={styles.statInfo}><span>DNA Strength</span><h3>{data?.dna_strength || 0}%</h3><div className={styles.progressBar}><div style={{ width: `${data?.dna_strength}%` }}></div></div></div></div>
        <div className={styles.statCard}><div className={`${styles.iconBox} ${styles.red}`}><ShieldAlert size={24} /></div><div className={styles.statInfo}><span>Threats Blocked</span><h3>{data?.threats_blocked || 0}</h3><p>Real-time preventions</p></div></div>
        <div className={styles.statCard}><div className={`${styles.iconBox} ${styles.green}`}><Zap size={24} /></div><div className={styles.statInfo}><span>Total Simulated</span><h3>{data?.total_simulations || 0}</h3><p>Verification events</p></div></div>
      </div>

      {/* --- NEW VISUALIZATION SECTION --- */}
      <div className={styles.chartGrid}>
        {/* AREA CHART: SECURITY TRENDS */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
             <h4><TrendingUp size={16} /> Security Monitoring Trend</h4>
             <small>Fraud attempts detected (7D)</small>
          </div>
          <div className={styles.areaChartWrapper}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0984e3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0984e3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="attempts" stroke="#0984e3" strokeWidth={3} fillOpacity={1} fill="url(#colorAttempts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT CHART: RISK COMPOSITION */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
             <h4><ShieldCheck size={16} /> Risk Composition</h4>
             <small>User interaction profile</small>
          </div>
          <div className={styles.donutWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={riskComposition} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {riskComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>
               <h3>{data?.dna_strength || 0}%</h3>
               <span>SAFE</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}><h3>Recent Security Events</h3><Link to="/dashboard/logs">View All</Link></div>
          <div className={styles.activityList}>
            {data?.recent_activity?.length > 0 ? data.recent_activity.map((item: any) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>{item.status === 'blocked' ? <ShieldAlert size={18} color="#ef4444" /> : <ShieldCheck size={18} color="#10b981" />}</div>
                <div className={styles.activityMeta}><strong>{item.merchant}</strong><small>ID: {item.id}</small></div>
                <div className={styles.activityRight}><strong>₦{item.amount.toLocaleString()}</strong><span className={styles[item.status]}>{item.status.toUpperCase()}</span></div>
              </div>
            )) : <div className={styles.emptyState}>No recent activity logs found.</div>}
          </div>
        </div>
        
        <div className={styles.actionSection}>
          {!data?.is_active ? (
            <div className={styles.onboardingCard}><Lock size={32} color="#0984e3" /><h3>Identity Missing</h3><button onClick={() => navigate('/dashboard/dna')} className={styles.primaryBtn}>Build My DNA <ArrowRight size={18} /></button></div>
          ) : (
            <div className={styles.actionCard}><h3>Security Sandbox</h3><button onClick={() => navigate('/dashboard/simulator')} className={styles.outlineBtn}>Enter Simulator <Zap size={18} /></button></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
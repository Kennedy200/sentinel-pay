import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, Key, Copy, Plus, CheckCircle2, 
  Terminal, ShieldCheck, ExternalLink, Loader2 
} from 'lucide-react';
import axios from 'axios';
import styles from './DeveloperHub.module.css';

const DeveloperHub: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/api/v1/dev/keys/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiKeys(res.data);
    } catch (err) {
      console.error("Failed to fetch keys");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post('http://127.0.0.1:8000/api/v1/dev/keys/', 
        { name: `Key_${apiKeys.length + 1}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiKeys([res.data, ...apiKeys]);
    } catch (err) {
      alert("Key generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) return <div className={styles.loaderArea}><Loader2 className={styles.spin} size={40} /></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Developer Hub</h1>
          <p>Integrate Sentinel AI into your own applications using secure API keys.</p>
        </div>
        <button 
          className={styles.generateBtn} 
          onClick={handleGenerateKey}
          disabled={isGenerating}
        >
          {isGenerating ? <Loader2 className={styles.spin} size={18} /> : <Plus size={18} />}
          Generate New Secret Key
        </button>
      </div>

      <div className={styles.layout}>
        {/* --- LEFT: API KEYS LIST --- */}
        <div className={styles.mainContent}>
          <div className={styles.sectionTitle}>
             <Key size={18} />
             <h3>Active Secret Keys</h3>
          </div>

          <div className={styles.keyList}>
            {apiKeys.length > 0 ? apiKeys.map((item) => (
              <div key={item.id} className={styles.keyCard}>
                <div className={styles.keyInfo}>
                  <strong>{item.name}</strong>
                  <div className={styles.keyValueGroup}>
                     <code>{item.key.substring(0, 12)}••••••••••••••••</code>
                     <button onClick={() => copyToClipboard(item.key)} className={styles.copyBtn}>
                        {copiedKey === item.key ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                     </button>
                  </div>
                  <small>Created: {new Date(item.created).toLocaleDateString()}</small>
                </div>
                <div className={styles.keyStatus}>
                   <span className={styles.statusBadge}>Production</span>
                </div>
              </div>
            )) : (
              <div className={styles.emptyState}>
                <Terminal size={40} color="#cbd5e1" />
                <p>No API keys generated yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: QUICK START GUIDE --- */}
        <aside className={styles.sidebar}>
          <div className={styles.guideCard}>
            <Code2 size={24} color="#0984e3" />
            <h4>Quick Start</h4>
            <p>Use the following header to authenticate your requests:</p>
            <div className={styles.snippet}>
              <code>X-Sentinel-Key: your_key_here</code>
            </div>
            <Link to="/docs" className={styles.docsLink}>
               Read API Documentation <ExternalLink size={14} />
            </Link>
          </div>

          <div className={styles.securityBox}>
             <ShieldCheck size={20} color="#10b981" />
             <div>
                <strong>Keep keys safe</strong>
                <p>Secret keys provide full access to your Behavioral DNA engine. Never share them in client-side code.</p>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DeveloperHub;
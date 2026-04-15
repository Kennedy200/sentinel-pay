import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styles from './Login.module.css';
import loginImg from '../../assets/login-picture.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Notification State ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false, message: '', type: 'success'
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showNotify = (message: string, type: 'success' | 'error') => setToast({ show: true, message, type });

  // --- Google Auth ---
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Exchange Access Token for JWT via backend
        const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/google/', {
          token: tokenResponse.access_token 
        });
        localStorage.setItem('accessToken', res.data.access);
        showNotify('Google Login Successful!', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        showNotify('Google Authentication failed.', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => showNotify('Google login was cancelled.', 'error'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/', {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('accessToken', res.data.access);
      showNotify('Welcome back! Securing session...', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      showNotify('Invalid email or password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{ position: 'fixed', top: 0, left: '50%', zIndex: 9999, padding: '12px 24px', borderRadius: '12px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444' }}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <div className={styles.logoWrapper} onClick={() => navigate('/')}><ShieldCheck size={28} /><span>Sentinel Pay</span></div>
          <div className={styles.header}><h1>Welcome Back</h1><p>Enter your email and password to access your account.</p></div>
          <form onSubmit={handleSubmit} className={styles.mainForm}>
            <div className={styles.inputGroup}><label>Email</label>
              <div className={styles.inputWrapper}><Mail size={18} className={styles.icon} />
                <input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required disabled={isLoading}/>
              </div>
            </div>
            <div className={styles.inputGroup}><label>Password</label>
              <div className={styles.inputWrapper}><Lock size={18} className={styles.icon} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required disabled={isLoading}/>
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div className={styles.optionsRow}><label className={styles.checkboxLabel}><input type="checkbox" checked={formData.rememberMe} onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})} /><span>Remember Me</span></label><Link to="/forgot-password" className={styles.forgotLink}>Forgot Your Password?</Link></div>
            <button type="submit" className={styles.loginBtn} disabled={isLoading}>{isLoading ? 'Verifying...' : 'Log In'}</button>
            <div className={styles.divider}><span>Or Login With</span></div>
            <button type="button" className={styles.googleBtn} onClick={() => handleGoogleLogin()} disabled={isLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>
          <p className={styles.footerText}>Don't Have An Account? <Link to="/signup">Register Now.</Link></p>
        </div>
      </div>
      <div className={styles.visualSide}>
        <div className={styles.visualContent}>
          <h2 className={styles.headline}>Effortlessly manage your <br />security and progress.</h2>
          <p className={styles.subheadline}>Log in to access your personalized dashboard and continue monitoring assets with AI.</p>
          <img src={loginImg} alt="Secure Login" className={styles.mainImg} />
        </div>
      </div>
    </div>
  );
};

export default Login;
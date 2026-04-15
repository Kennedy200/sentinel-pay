import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styles from './Signup.module.css';
import signupImg from '../../assets/signup.png';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showNotify = (message: string, type: 'success' | 'error') => setToast({ show: true, message, type });

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/google/', { token: tokenResponse.access_token });
        localStorage.setItem('accessToken', res.data.access);
        showNotify('Welcome to Sentinel Pay!', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        showNotify('Google Signup failed.', 'error');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords mismatch';
    if (!formData.agreeTerms) newErrors.terms = 'Agreement required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const [firstName, ...lastName] = formData.fullName.trim().split(' ');
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/auth/register/', {
        email: formData.email, first_name: firstName, last_name: lastName.join(' '), password: formData.password
      });
      showNotify('Account created! Redirecting to login...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      showNotify(err.response?.data?.email ? 'Email already exists.' : 'Server error.', 'error');
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

      <div className={styles.visualSide}>
        <div className={styles.logoWrapper} onClick={() => navigate('/')}><ShieldCheck size={28} /><span>Sentinel Pay</span></div>
        <div className={styles.visualContent}><img src={signupImg} alt="Secure AI" className={styles.mainImg} /><h2 className={styles.headline}>The last defense for your <br /><span>digital wealth.</span></h2><p className={styles.subheadline}>Join users protecting their DNA with behavioral intelligence.</p></div>
        <div className={styles.decorationCircle}></div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}><h1>Create Account</h1><p>Secure your future with <span>Sentinel Pay</span></p></div>
          <button type="button" className={styles.googleBtn} onClick={() => handleGoogleSignup()} disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          <div className={styles.divider}><span>or use email</span></div>
          <form onSubmit={handleSubmit} className={styles.mainForm}>
            <div className={styles.inputGroup}><div className={`${styles.inputWrapper} ${errors.fullName ? styles.inputError : ''}`}><User size={18} className={styles.icon} /><input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} disabled={isLoading}/></div>{errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}</div>
            <div className={styles.inputGroup}><div className={`${styles.inputWrapper} ${errors.email ? styles.inputError : ''}`}><Mail size={18} className={styles.icon} /><input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={isLoading}/></div>{errors.email && <span className={styles.errorText}>{errors.email}</span>}</div>
            <div className={styles.inputGroup}><div className={`${styles.inputWrapper}`}><Lock size={18} className={styles.icon} /><input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} disabled={isLoading}/><button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            <div className={styles.inputGroup}><div className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.inputError : ''}`}><Lock size={18} className={styles.icon} /><input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} disabled={isLoading}/><button type="button" className={styles.eyeBtn} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}</div>
            <div className={styles.termsRow}><input type="checkbox" id="terms" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} disabled={isLoading}/><label htmlFor="terms">I agree to the <Link to="/terms">Terms of Service</Link></label></div>
            <button type="submit" className={styles.proceedBtn} disabled={isLoading}>{isLoading ? 'Creating...' : <>Create Account <ArrowRight size={18} /></>}</button>
          </form>
          <p className={styles.footerText}>Already a member? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
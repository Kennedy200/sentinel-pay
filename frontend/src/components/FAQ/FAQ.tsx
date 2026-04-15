import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const faqData = [
  {
    question: "Why do I need to upload my transaction history?",
    answer: "Traditional banks use the same generic security rules for everyone. By securely scanning your past transactions, our AI learns your unique spending habits—your 'Behavioral DNA.' This allows us to instantly spot a hacker trying to impersonate you, while stopping annoying false alarms on your normal payments."
  },
  {
    question: "Is my uploaded financial data safe?",
    answer: "Absolutely. We use bank-grade AES-256 encryption. Our system only extracts mathematical patterns (like your average spending amount and typical active hours) to train your personal AI. We do not store your raw bank passwords or sensitive account numbers."
  },
  {
    question: "How fast does the AI block fraudulent transactions?",
    answer: "In less than 100 milliseconds. Our ensemble machine learning engine works in the background to analyze dozens of risk factors instantly. This ensures your legitimate payments go through without delay, while fraud is stopped before the money ever leaves your account."
  },
  {
    question: "What happens if the AI blocks a transaction I actually made?",
    answer: "If a payment is flagged, it is temporarily held and you are notified immediately. Because our AI is 'Explainable' (using SHAP technology), it will tell you exactly why it was cautious (e.g., 'Unusually high amount from a new device'). You can click 'Approve' to release the funds, which also trains the AI to recognize this new behavior for next time."
  },
  {
    question: "Does Sentinel-Pay work with my current bank or mobile money app?",
    answer: "Sentinel-Pay is designed as a next-generation security layer for Nigerian fintechs. Currently, you can upload CSV or PDF statements directly from platforms like OPay, PalmPay, and Kuda to build your profile and simulate how our AI protects your money better than traditional systems."
  }
];

const FAQ: React.FC = () => {
  // Track which FAQ item is currently open
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // 0 makes the first one open by default

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Got Questions?</span>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about how Sentinel-Pay secures your money using Behavioral AI.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            >
              <button 
                className={styles.faqQuestion} 
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`${styles.icon} ${activeIndex === index ? styles.iconRotated : ''}`} 
                />
              </button>
              
              {/* CSS Grid trick for smooth height animation */}
              <div className={styles.faqAnswerWrapper}>
                <div className={styles.faqAnswerInner}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
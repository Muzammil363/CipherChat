import React from 'react';
import styles from '../styles/Features.module.css';

const Features = () => {
  const features = [
    {
      icon: '💬',
      title: 'Real-time Messaging',
      description: 'Send and receive messages instantly with our lightning-fast messaging system.'
    },
    {
      icon: '🔒',
      title: 'End-to-End Encryption',
      description: 'Your conversations are protected with military-grade encryption for complete privacy.'
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      description: 'Access your chats from any device - mobile, tablet, or desktop.'
    },
    {
      icon: '🎨',
      title: 'Rich Media Sharing',
      description: 'Share photos, videos, documents, and more with your friends effortlessly.'
    },
    {
      icon: '👥',
      title: 'Group Chats',
      description: 'Create groups with up to 1000 members and stay connected with your communities.'
    },
    {
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Switch between light and dark themes for a comfortable chatting experience.'
    }
  ];

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header} data-aos="fade-up">
          <h2>Why Choose ChatApp?</h2>
          <p>Discover the features that make ChatApp the perfect choice for modern communication</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={styles.featureCard}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
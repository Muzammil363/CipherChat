import React, { useState } from 'react';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    profilePhoto: '👤'
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const profilePhotos = ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍⚕️', '👩‍⚕️', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', '👨‍🏫', '👩‍🏫', '🧑‍💼'];

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // Here you would typically make an API call to change the password
    console.log('Password change request:', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePhotoSelect = (photo) => {
    setUser({ ...user, profilePhoto: photo });
    setShowPhotoModal(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Here you would typically clear user session and redirect
      console.log('User logged out');
      alert('Logged out successfully!');
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className={styles.profileContainer}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>💬</div>
            <h2 className={styles.brandName}>ChatApp</h2>
          </div>
          
          <div className={styles.navLinks}>
            <a href="#" className={styles.navLink}>
              <span className={styles.navIcon}>🏠</span>
              Home
            </a>
            <a href="#" className={styles.navLink}>
              <span className={styles.navIcon}>📨</span>
              Requests
            </a>
            <a href="#" className={`${styles.navLink} ${styles.active}`}>
              <span className={styles.navIcon}>👤</span>
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className={styles.profileContent}>
        <div className={styles.profileCard}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profilePhotoSection}>
              <div className={styles.profilePhoto}>
                <span>{user.profilePhoto}</span>
              </div>
              <button 
                className={styles.changePhotoBtn}
                onClick={() => setShowPhotoModal(true)}
              >
                📷
              </button>
            </div>
            <div className={styles.profileInfo}>
              <h1>{user.fullName}</h1>
              <p>{user.email}</p>
              <div className={styles.statusBadge}>
                <span className={styles.onlineIndicator}></span>
                Online
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className={styles.profileActions}>
            <div className={styles.actionSection}>
              <h3>Account Settings</h3>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.actionBtn}
                  onClick={() => setShowPasswordModal(true)}
                >
                  <span className={styles.actionIcon}>🔒</span>
                  <div className={styles.actionText}>
                    <h4>Change Password</h4>
                    <p>Update your account password</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>

                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>✏️</span>
                  <div className={styles.actionText}>
                    <h4>Edit Profile</h4>
                    <p>Update your personal information</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>

                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>🔔</span>
                  <div className={styles.actionText}>
                    <h4>Notifications</h4>
                    <p>Manage notification preferences</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>

                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>🔐</span>
                  <div className={styles.actionText}>
                    <h4>Privacy & Security</h4>
                    <p>Control your privacy settings</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>
              </div>
            </div>

            <div className={styles.actionSection}>
              <h3>Support</h3>
              <div className={styles.actionButtons}>
                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>❓</span>
                  <div className={styles.actionText}>
                    <h4>Help Center</h4>
                    <p>Get help and support</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>

                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>📞</span>
                  <div className={styles.actionText}>
                    <h4>Contact Support</h4>
                    <p>Reach out to our team</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>
              </div>
            </div>

            <div className={styles.logoutSection}>
              <button 
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                <span className={styles.logoutIcon}>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Change Password</h3>
              <button 
                className={styles.closeBtn}
                onClick={cancelPasswordChange}
              >
                ✕
              </button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handlePasswordSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={styles.inputField}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={styles.inputField}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={styles.inputField}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={cancelPasswordChange}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Photo Selection Modal */}
      {showPhotoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Choose Profile Photo</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowPhotoModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.photoGrid}>
              {profilePhotos.map((photo, index) => (
                <button
                  key={index}
                  className={`${styles.photoOption} ${user.profilePhoto === photo ? styles.selected : ''}`}
                  onClick={() => handlePhotoSelect(photo)}
                >
                  <span>{photo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
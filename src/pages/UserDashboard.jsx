import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Plantrip<span>Online</span>
          </Link>
        </div>
        
        <nav className={styles.sidebarNav}>
          <ul>
            <li><Link to="/user-dashboard" className={`${styles.sidebarLink} ${styles.active}`}>My Profile</Link></li>
            <li><Link to="/user-dashboard/trips" className={styles.sidebarLink}>My Trips</Link></li>
            <li><Link to="/user-dashboard/favorites" className={styles.sidebarLink}>Favorites</Link></li>
            <li><Link to="/user-dashboard/settings" className={styles.sidebarLink}>Settings</Link></li>
          </ul>
        </nav>

        <div className={styles.logoutBtn}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>Dashboard</div>
          <div className={styles.userInfo}>
            <span>Welcome!</span>
            <div className={styles.userAvatar}>U</div>
          </div>
        </header>

        <div className={styles.contentBody}>
          <div className={styles.welcomeCard}>
            <h2>Welcome to your Dashboard</h2>
            <p>Manage your trips, profile, and preferences here.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Upcoming Trips</h3>
              <div className={styles.statValue}>0</div>
            </div>
            <div className={styles.statCard}>
              <h3>Past Trips</h3>
              <div className={styles.statValue}>0</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
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
            Admin<span>Panel</span>
          </Link>
        </div>
        
        <nav className={styles.sidebarNav}>
          <ul>
            <li><Link to="/admin-dashboard" className={`${styles.sidebarLink} ${styles.active}`}>Dashboard</Link></li>
            <li><Link to="/admin-dashboard/users" className={styles.sidebarLink}>Users</Link></li>
            <li><Link to="/admin-dashboard/bookings" className={styles.sidebarLink}>Bookings</Link></li>
            <li><Link to="/admin-dashboard/packages" className={styles.sidebarLink}>Packages</Link></li>
            <li><Link to="/admin-dashboard/settings" className={styles.sidebarLink}>Settings</Link></li>
          </ul>
        </nav>

        <div className={styles.logoutBtn}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>Overview</div>
          <div className={styles.userInfo}>
            <span>Admin User</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </header>

        <div className={styles.contentBody}>
          <div className={styles.welcomeCard}>
            <h2>Welcome back, Admin!</h2>
            <p>Here's what's happening with your platform today.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Users</h3>
              <div className={styles.statValue}>1,245</div>
            </div>
            <div className={styles.statCard}>
              <h3>Active Bookings</h3>
              <div className={styles.statValue}>84</div>
            </div>
            <div className={styles.statCard}>
              <h3>Total Revenue</h3>
              <div className={styles.statValue}>$45k</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

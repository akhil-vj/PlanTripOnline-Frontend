import React from 'react';
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import UsersList from '../components/admin/UsersList';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

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
            <li><Link to="/admin-dashboard" className={`${styles.sidebarLink} ${location.pathname === '/admin-dashboard' ? styles.active : ''}`}>Dashboard</Link></li>
            <li><Link to="/admin-dashboard/users" className={`${styles.sidebarLink} ${location.pathname.includes('/users') ? styles.active : ''}`}>Users</Link></li>
            <li><Link to="/admin-dashboard/bookings" className={`${styles.sidebarLink} ${location.pathname.includes('/bookings') ? styles.active : ''}`}>Bookings</Link></li>
            <li><Link to="/admin-dashboard/packages" className={`${styles.sidebarLink} ${location.pathname.includes('/packages') ? styles.active : ''}`}>Packages</Link></li>
            <li><Link to="/admin-dashboard/settings" className={`${styles.sidebarLink} ${location.pathname.includes('/settings') ? styles.active : ''}`}>Settings</Link></li>
          </ul>
        </nav>

        <div className={styles.logoutBtn}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            {location.pathname.includes('/users') ? 'Users Management' : 'Overview'}
          </div>
          <div className={styles.userInfo}>
            <span>Admin User</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </header>

        <div className={styles.contentBody}>
          <Routes>
            <Route index element={
              <>
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
              </>
            } />
            <Route path="users" element={<UsersList />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

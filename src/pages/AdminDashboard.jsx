import React from 'react';
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import UsersList from '../components/admin/UsersList';
import styles from './Dashboard.module.css';
import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <Helmet>
        <title>Admin Dashboard - PlantripOnline</title>
      </Helmet>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            PlanTrip<span>Admin</span>
          </Link>
        </div>
        
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link to="/admin-dashboard" className={`${styles.sidebarLink} ${location.pathname === '/admin-dashboard' ? styles.active : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Overview
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/users" className={`${styles.sidebarLink} ${location.pathname.includes('/users') ? styles.active : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/bookings" className={`${styles.sidebarLink} ${location.pathname.includes('/bookings') ? styles.active : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/packages" className={`${styles.sidebarLink} ${location.pathname.includes('/packages') ? styles.active : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Packages
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/settings" className={`${styles.sidebarLink} ${location.pathname.includes('/settings') ? styles.active : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.logoutBtn}>
          <button onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentBody}>
          <Routes>
            <Route index element={
              <>
                <div className={styles.welcomeCard}>
                  <div>
                    <h2>Welcome back, Admin! 🚀</h2>
                    <p>Here's a quick overview of what's happening across PlantripOnline today.</p>
                  </div>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <h3>Total Users</h3>
                      <div className={`${styles.statIcon} ${styles.users}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      </div>
                    </div>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statTrend} style={{color: '#64748b'}}>
                      No data available
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <h3>Active Bookings</h3>
                      <div className={`${styles.statIcon} ${styles.bookings}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                    </div>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statTrend} style={{color: '#64748b'}}>
                      No data available
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <h3>Total Revenue</h3>
                      <div className={`${styles.statIcon} ${styles.revenue}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </div>
                    </div>
                    <div className={styles.statValue}>$0</div>
                    <div className={styles.statTrend} style={{color: '#64748b'}}>
                      No data available
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <h3>Active Packages</h3>
                      <div className={`${styles.statIcon} ${styles.packages}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                      </div>
                    </div>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statTrend} style={{color: '#64748b'}}>
                      No data available
                    </div>
                  </div>
                </div>

                <div className={styles.dashboardMiddleSection}>
                  <div className={styles.chartContainer}>
                    <div className={styles.tableHeader}>
                      <h3>Revenue Overview</h3>
                      <select className={styles.filterSelect}>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                      </select>
                    </div>
                    <div className={styles.mockChart}>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Mon</span></div>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Tue</span></div>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Wed</span></div>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Thu</span></div>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Fri</span></div>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Sat</span></div>
                      <div className={styles.chartBarWrapper}><div className={styles.chartBar} style={{ height: '0%' }}></div><span>Sun</span></div>
                    </div>
                  </div>

                  <div className={styles.activityContainer}>
                    <div className={styles.tableHeader}>
                      <h3>Recent Activity</h3>
                    </div>
                    <div className={styles.activityList}>
                      <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: '0.9rem' }}>
                        No recent activity found.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings Table (Mock) */}
                <div className={styles.tableContainer}>
                  <div className={styles.tableHeader}>
                    <h3>Recent Bookings</h3>
                    <button className={styles.viewAllBtn}>View All Bookings</button>
                  </div>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                          No recent bookings found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            } />
            <Route path="users" element={<UsersList />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '20px', opacity: 0.5 }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                <h3>Module Coming Soon</h3>
                <p>This admin module is currently under development.</p>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

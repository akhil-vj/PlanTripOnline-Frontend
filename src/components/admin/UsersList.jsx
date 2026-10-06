import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../config/api';
import styles from '../../pages/Dashboard.module.css';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch users`);
      }

      const data = await response.json();
      setUsers(data.users || data || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: 0 }}>Users Management</h2>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>View and manage all registered users.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              outline: 'none',
              minWidth: '220px',
            }}
          />
          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          {/* Refresh */}
          <button
            onClick={fetchUsers}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid #e2e8f0',
            borderTopColor: '#ff9800', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading users...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{
          background: '#fff1f2', border: '1px solid #fecdd3',
          color: '#be123c', padding: '1rem 1.5rem', borderRadius: '8px',
          marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td style={{ color: '#64748b' }}>{user.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${user.role === 'Admin' ? styles.roleAdmin : styles.roleUser}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${user.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>{user.date}</td>
                    <td>
                      <button className={styles.actionBtn}>Edit</button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          {filteredUsers.length > 0 && (
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.8rem' }}>
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </div>
      )}
    </div>
  );
}

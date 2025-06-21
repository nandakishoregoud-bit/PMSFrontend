import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem('token');
        localStorage.clear();

        navigate('/');
    };

    return (
        <div style={styles.sidebar}>
            <h3 style={styles.heading}>Admin Portal</h3>
            <ul style={styles.navList}>
                <li onClick={() => navigate('/dashboard')}>Dashboard</li>
                <li onClick={() => navigate('/employees')}>View All Employees</li>
                <li onClick={() => navigate('/projects')}>View All Projects</li>
                <li style={styles.listItem} onClick={handleLogout}>Logout</li>
            </ul>

        </div>
    );
};

const styles = {
    sidebar: {
        width: '220px',
        height: '120vh',
        backgroundColor: '#343a40',
        color: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
    },
    heading: {
        fontSize: '20px',
        marginBottom: '30px',
    },
    navList: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        marginBottom: '20px',
        cursor: 'pointer',
    },
};

export default Sidebar;

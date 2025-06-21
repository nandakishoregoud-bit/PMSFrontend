import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const BASE_URL = 'http://localhost:8080/api';

const ManagerHeader = () => {
    const navigate = useNavigate();
    const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
        const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
    

    const handleLogout = async () => {
                const token = localStorage.getItem('token');
                const empId = localStorage.getItem('empId');
        
                try {
                    
                    // Call backend logout endpoint
                    await axios.post(`${BASE_URL}/login/logout/${empId}`, null, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
        
                } catch (error) {
                    console.error('Error during logout:', error);
                    alert('Logout failed');
                }
        
                localStorage.clear();
                navigate('/');
            };

    return (
        <header style={styles.header}>
            <img src="/pcs.jpg" alt="Logo" style={styles.logo} onClick={() => navigate('/Managerdashboard')} ></img>
            <h2 style={styles.title}>Manager Project Managment System</h2>
            <nav style={styles.nav}>

                <ul style={styles.navList}>
                    <li style={styles.navItem} onClick={() => navigate('/Manprofile')}>Profile</li>
                    <li style={styles.navItem} onClick={() => navigate('/Manprojects')}>Assined Projects</li>
                    <li style={styles.navItem} onClick={() => navigate('/mandailyreport')}>Daily Report</li>
                    
                    <li
                        style={{ ...styles.navItem, position: 'relative' }}
                        onMouseEnter={() => setTaskDropdownOpen(true)}
                        onMouseLeave={() => setTaskDropdownOpen(false)}
                    >
                        Srores ▾
                        {taskDropdownOpen && (
                            <ul style={styles.dropdownMenu}>
                                <li style={styles.dropdownItem} onClick={() => navigate('/Mantasks')}>Assign Stores</li>
                                <li style={styles.dropdownItem} onClick={() => navigate('/ManTasksToYou')}>Assigned Stores</li>
                            </ul>
                        )}
                    </li>
                    
                    
                    <li style={{ ...styles.navItem, ...styles.logout }} onClick={handleLogout}>Logout</li>
                </ul>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        width: '100%',
        backgroundColor: '#2196f3',
        color: 'white',
        padding: '0 20px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // centers title only
        boxSizing: 'border-box',
        height: '60px',
    },

    logo: {
        width: '150px',
        height: '100%',
        objectFit: 'contain',
        position: 'absolute',
        left: '20px',
    },
    
    title: {
        margin: 0,
        fontSize: '24px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none', // so clicks pass through if needed
        userSelect: 'none',
    },
    nav: {
        position: 'absolute',
        right: '20px',
    },
    navList: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '20px',
    },
    navItem: {
        cursor: 'pointer',
        userSelect: 'none',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: '#2196f3',
        color: 'white',
        listStyleType: 'none',
        padding: '10px 0',
        margin: 0,
        borderRadius: '5px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
    },
    dropdownItem: {
        padding: '10px 20px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    logout: {
        color: '#ff4d4f',
        fontWeight: 'bold',
    },
};

export default ManagerHeader;

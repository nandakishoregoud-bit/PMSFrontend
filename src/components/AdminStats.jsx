import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export const BASE_URL = 'http://localhost:8080/api';

const AdminStats = () => {
    const [stats, setStats] = useState({
        employeeCount: 0,
        projectCount: 0,
        completedProjectCount: 0,
        exEmployeeCount: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${BASE_URL}/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch statistics');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading stats...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            <h2>What We Have</h2>
            <div style={styles.cardContainer}>
                <StatCard label="Active Employees" value={stats.employeeCount} />
                <StatCard label="Total Projects" value={stats.projectCount} />
                <StatCard label="Completed Projects" value={stats.completedProjectCount} />
                <StatCard label="Ex Employees" value={stats.exEmployeeCount} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1000;
        const increment = end / 20;
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, duration / 20);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            style={styles.card}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 2, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{
                scale: 1.95,
                boxShadow: "0px 10px 20px rgba(0, 123, 255, 0.4)",
                transition: { duration: 0.3 }
            }}
        >
            <p style={styles.count}>{count}</p>
            <h3>{label}</h3>
        </motion.div>
    );
};


const styles = {
    container: {
        padding: '50px',
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    count: {
        fontSize: '80px',
        color: '#007bff',
        fontWeight: 'bold',
        margin: '10px 0 0 0'
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        marginTop: '50px',
        flexWrap: 'wrap'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        width: '220px',
        textAlign: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s',
    },
};

export default AdminStats;

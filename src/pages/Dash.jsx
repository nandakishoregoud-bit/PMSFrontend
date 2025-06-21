import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dash = () => {
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
                const response = await axios.get('http://localhost:8080/api/admin/stats', {
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
            <div style={styles.cardContainer}>
                <StatCard label="Active Employees" value={stats.employeeCount} />
                <StatCard label="Total Projects" value={stats.projectCount} />
                <StatCard label="Completed Projects" value={stats.completedProjectCount} />
                <StatCard label="Ex Employees" value={stats.exEmployeeCount} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div style={styles.card}>
        <p style={styles.count}>{value}</p>
        <h3>{label}</h3>

    </div>
);

const styles = {
    container: {
        padding: '50px',
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    count: {
        fontSize: '100px',
        color: '#007bff',
        fontWeight: 'bold',
        margin: '10px 0 0 0'
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '100px',
        marginTop: '50px',
        flexWrap: 'wrap'
    },
    card: {
        backgroundColor: '#ffff',
        padding: '20px',
        borderRadius: '10px',
        width: '200px',
        textAlign: 'center',
        boxShadow: '10px 10px 10px rgba(0,0,0,0.6)'
    }
};


export default Dash;

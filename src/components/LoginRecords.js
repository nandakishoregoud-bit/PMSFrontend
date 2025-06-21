import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api';

const LoginRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    const fetchLoginRecords = () => {
        const token = localStorage.getItem('token');
        const params = { page, size };
        if (employeeId) params.employeeId = employeeId;
        if (employeeName) params.employeeName = employeeName;
        if (fromDate) params.from = new Date(fromDate).toISOString();
        if (toDate) params.to = new Date(toDate).toISOString();

        axios.get(`${BASE_URL}/admin/employees/loginreports`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params
        })
            .then(res => {
                setRecords(res.data.content);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching login records:', err);
                alert('Failed to load login records');
                setLoading(false);
            });
    };

    const exportData = (format) => {
        const token = localStorage.getItem('token');
        const params = { format };
        if (employeeId) params.employeeId = employeeId;
        if (employeeName) params.employeeName = employeeName;
        if (fromDate) params.from = new Date(fromDate).toISOString();
        if (toDate) params.to = new Date(toDate).toISOString();

        axios.get(`${BASE_URL}/admin/employees/loginreports/export`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params,
            responseType: 'blob'
        })
            .then(res => {
                const blob = new Blob([res.data], {
                    type: format === 'excel'
                        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        : 'application/pdf'
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `login_records.${format === 'excel' ? 'xlsx' : 'pdf'}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(err => {
                console.error('Export failed:', err);
                alert('Failed to export records.');
            });
    };

    useEffect(() => {
        fetchLoginRecords();
    }, [page, size]);

    if (loading) return <p>Loading login records...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Login Records</h2>

            <div style={styles.filters}>
                <input
                    type="text"
                    placeholder="Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    style={styles.input}
                />
                <button onClick={fetchLoginRecords} style={styles.button}>Search</button>
                <button onClick={() => exportData('pdf')} style={styles.exportButton}>Export PDF</button>
                <button onClick={() => exportData('excel')} style={styles.exportButton}>Export Excel</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Employee ID</th>
                        <th style={styles.th}>Employee Name</th>
                        <th style={styles.th}>Login Time</th>
                        <th style={styles.th}>Logout Time</th>
                        <th style={styles.th}>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id} style={styles.tr}>
                            <td style={styles.td}>{record.employeeId}</td>
                            <td style={styles.td}>{record.employeeName}</td>
                            <td style={styles.td}>{record.loginTime ? new Date(record.loginTime).toLocaleString() : 'N/A'}</td>
                            <td style={styles.td}>{record.logoutTime ? new Date(record.logoutTime).toLocaleString() : 'N/A'}</td>
                            <td style={styles.td}>{record.duration || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        style={{
                            ...styles.pageButton,
                            backgroundColor: i === page ? '#007bff' : '#fff',
                            color: i === page ? '#fff' : '#000'
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    filters: {
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        minWidth: '150px',
    },
    button: {
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    exportButton: {
        padding: '8px 12px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        border: '1px solid #ddd',
        padding: '12px',
        backgroundColor: '#f4f4f4',
        fontWeight: 'bold',
    },
    td: {
        border: '1px solid #ddd',
        padding: '10px',
        textAlign: 'center',
    },
    tr: {
        backgroundColor: '#fff',
        transition: 'background-color 0.2s',
    },
    pagination: {
        marginTop: '20px',
        textAlign: 'center',
    },
    pageButton: {
        margin: '0 5px',
        padding: '6px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

export default LoginRecords;

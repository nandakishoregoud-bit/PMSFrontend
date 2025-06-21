import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api'

const InactiveEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const [searchField, setSearchField] = useState('name');

    useEffect(() => {
        fetchInactiveEmployees(page);
    }, [page]);

    const fetchInactiveEmployees = async (page = 0, size = 20) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/admin/employees/requests?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching inactive employees:', error);
        }
    };

    const handleUpdate = async (id) => {
        if (!window.confirm('Are you sure you want to Approve this employee?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/admin/employees/${id}/status`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchInactiveEmployees(page); // refresh current page
        } catch (error) {
            console.error('Error Approving employee:', error);
            alert('Failed to Update employee');
        }
    };

    const handleDelete = async (id) => {
            if (!window.confirm('Are you sure you want to delete this employee?')) return;
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${BASE_URL}/admin/employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchInactiveEmployees(); // refresh list
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee');
            }
        };
    const filteredEmployees = employees.filter((emp) => {
        const fieldValue = emp[searchField];
        return fieldValue && fieldValue.toString().toLowerCase().includes(search.toLowerCase());
    });
    

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchInactiveEmployees(pageNumber - 1); // Backend page index is 0-based
    };
    

    return (
        <div style={styles.container}>
            <h2>Inactive Employees</h2>

            <div style={styles.searchContainer}>
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    style={styles.dropdown}
                >

                    <option value="empId">EmpID</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="designation">Designation</option>
                    <option value="department">Department</option>
                    <option value="skills">Skills</option>
                </select>

                <input
                    type="text"
                    placeholder={`Search by ${searchField}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>EmpID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Designation</th>
                        <th style={styles.th}>Department</th>
                        <th style={styles.th}>Skills</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td style={styles.td}>{emp.empId}</td>
                                <td style={styles.td}>{emp.name}</td>
                                <td style={styles.td}>{emp.email}</td>
                                <td style={styles.td}>{emp.designation}</td>
                                <td style={styles.td}>{emp.department}</td>
                                <td style={styles.td}>{emp.skills}</td>
                                <td style={styles.td}>{emp.status}</td>
                                <td style={styles.td}>
                                    <button style={styles.updateBtn} onClick={() => handleUpdate(emp.id)}>Update</button>
                                    <button style={styles.deleteBtn} onClick={() => handleDelete(emp.id)}>Delete</button>
                                </td>
                                
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No inactive employees found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={styles.pagination}>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            ...styles.pageButton,
                            backgroundColor: currentPage === index + 1 ? '#2563eb' : '#e5e7eb',
                            color: currentPage === index + 1 ? '#fff' : '#000', cursor: 'pointer',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
                
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
    },
    th: {
        padding: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#e9ecef',
        textAlign: 'left',
    },
    td: {
        padding: '10px',
        border: '1px solid #ccc',
    },
    updateBtn: {
        marginRight: '8px',
        padding: '6px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '6px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    searchInput: {
        marginBottom: '10px',
        padding: '8px',
        width: '300px',
    },
    searchContainer: {
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
    },
    dropdown: {
        padding: '8px',
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
        cursor: 'pointer',
    },
    pagination: {
        marginTop: '15px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',

    },
};

export default InactiveEmployees;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api'

const DiactiveEmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        empId: '',
        name: '',
        email: '',
        designation: '',
        department: '',
        skills: '',
        role: '',
        
    });
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [searchField, setSearchField] = useState('name'); // default field

    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 10;

    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async (page = 0, size = 20) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/admin/employees/diactive?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEmployees(response.data.content); // .content holds actual employee data
            setTotalPages(response.data.totalPages); // set total pages for pagination buttons
        } catch (error) {
            console.error('Error fetching employees:', error);
            alert('Session expired or not authorized. Please log in again.');
        }
    };
    

    const filteredEmployees = employees.filter((emp) => {
        const fieldValue = emp[searchField];
        return fieldValue && fieldValue.toString().toLowerCase().includes(search.toLowerCase());
    });
    
    
    

    
    const handleActivate = async (id) => {
        if (!window.confirm('Are you sure you want to Activate this employee?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/admin/employees/${id}/active`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchEmployees(); // refresh list
        } catch (error) {
            console.error('Error Activating employee:', error);
            alert('Failed to active employee');
        }
    };
    

    

   
    // Pagination Logic
    

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchEmployees(pageNumber - 1); // Backend page index is 0-based
    };
    

    //<th style={styles.th}>ID</th>
    //<td style={styles.td}>{emp.id}</td>

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>All DiActive Employees</h2>
            </div>
            
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
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>Designation</th>
                        
                        <th style={styles.th}>Department</th>
                        <th style={styles.th}>Skills</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                            
                            <td style={styles.td}>{emp.empId}</td>
                            <td style={styles.td}>{emp.name}</td>
                            <td style={styles.td}>{emp.email}</td>
                            <td style={styles.td}>{emp.role}</td>
                            <td style={styles.td}>{emp.designation}</td>
                            <td style={styles.td}>{emp.department}</td>
                            <td style={styles.td}>{emp.skills}</td>
                            <td style={styles.td}>
                                <button style={styles.deleteBtn} onClick={() => handleActivate(emp.id)}>Activate</button>
                            </td>
                        </tr>
                    ))}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    addButton: {
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '10px 10px 10px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '500px',
        boxShadow: '10px 10px 10px rgba(0,0,0,0.6)',
    },
    input: {
        display: 'block',
        width: '100%',
        marginBottom: '10px',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    saveBtn: {
        padding: '6px 12px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelBtn: {
        padding: '6px 12px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    searchInput: {
        marginBottom: '10px',
        padding: '8px',
        width: '300px',
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
    editBtn: {
        marginRight: '8px',
        padding: '4px 8px',
        backgroundColor: '#ffc107',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '4px 8px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
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

export default DiactiveEmployeeTable;

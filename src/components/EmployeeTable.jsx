import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api'

const EmployeeTable = () => {
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
    const role = localStorage.getItem('role');

    const fetchEmployees = async (page = 0, size = 25) => {
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/admin/employees?page=${page}&size=${size}`, {
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
    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleAdd = () => {
        setNewEmployee({ empId: '', name: '', email: '', designation: '', department: '', skills:'', role:'',});
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const { empId, name, email, designation, department, skills,role } = newEmployee;
            if (!empId || !name || !email || !designation || !department || !skills || !role ) {
                alert("Please fill in all required fields.");
                return;
            }
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/admin/employees`, newEmployee, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee');
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
            fetchEmployees(); // refresh list
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
        }
    };
    

    const handleEdit = (emp) => {
        setIsEditMode(true);
        setEditingEmployee(emp);
        setNewEmployee({
            empId: emp.empId,
            name: emp.name,
            email: emp.email,
            designation: emp.designation,
            department: emp.department,
            skills: emp.skills,
            role:emp.role,
        });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const { empId, name, email, designation, department, skills,role } = newEmployee;
            if (!empId || !name || !email || !designation || !department || !skills || !role ) {
                alert("Please fill in all required fields.");
                return;
            }
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/admin/employees/${editingEmployee.id}`, newEmployee, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowModal(false);
            setIsEditMode(false);
            setEditingEmployee(null);
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee');
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingEmployee(null);
        setNewEmployee({ empId: '', name: '', email: '', designation: '', department: '', skills:'', role:'' });
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
                <h2>All Employees</h2>
                <button style={styles.addButton} onClick={handleAdd}>+ Add New Employee</button>
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
                                <button style={styles.editBtn} onClick={() => handleEdit(emp)}>Edit</button>
                                <button style={styles.deleteBtn} onClick={() => handleDelete(emp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            
            {showModal && (
                
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h3>
                        <strong>Employee Id:</strong>
                        <input
                            style={styles.input}
                            name="empId"
                            value={newEmployee.empId}
                            placeholder="Emp ID"
                            onChange={handleInputChange}
                            required
                        />
                        <strong>Employee Name:</strong>
                        <input
                            style={styles.input}
                            name="name"
                            value={newEmployee.name}
                            placeholder="Name"
                            onChange={handleInputChange}
                            required
                        />
                        <strong>Email:</strong>
                        <input
                            style={styles.input}
                            name="email"
                            value={newEmployee.email}
                            placeholder="Email"
                            onChange={handleInputChange}
                            required
                        />
                        <strong>Role:</strong>
                        
                        <select style={styles.input} name="role" value={newEmployee.role} onChange={handleInputChange}>
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                        </select>
                        <strong>Designation:</strong>
                        <input
                            style={styles.input}
                            name="designation"
                            value={newEmployee.designation}
                            placeholder="Designation"
                            onChange={handleInputChange}
                            required
                        />
                        <strong>Department:</strong>
                        <input
                            style={styles.input}
                            name="department"
                            value={newEmployee.department}
                            placeholder="Department"
                            onChange={handleInputChange}
                            required
                        />
                        <strong>Skills:</strong>
                        <input
                            style={styles.input}
                            name="skills"
                            value={newEmployee.skills}
                            placeholder="Skills"
                            onChange={handleInputChange}
                            required
                        />
                        
                        <div style={styles.modalButtons}>
                            <button style={styles.saveBtn} onClick={isEditMode ? handleUpdate : handleSave}>
                                {isEditMode ? 'Update' : 'Save'}
                            </button>
                            <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
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

export default EmployeeTable;

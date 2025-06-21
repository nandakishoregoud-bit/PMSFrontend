import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

export const BASE_URL = 'http://localhost:8080/api'

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        status: '',
        startDate: '',
        endDate: '',
        assignedEmployeeIds: '',
    });
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [assigningEmpId, setAssigningEmpId] = useState({});
    const [empIdError, setEmpIdError] = useState({});
    const [searchField, setSearchField] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProject, setExpandedProject] = useState(null);
    const [viewAllEmployeesProject, setViewAllEmployeesProject] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [viewAllFilesProject, setViewAllFilesProject] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});
     const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchProjects();
    }, []);
    const employeeOptionsFormatted = employeeOptions.map(emp => ({
        value: emp.id,
        label: `${emp.name} (${emp.empId})`
    }));
    const fetchProjects = async (page = 0, size = 12) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_URL}/admin/projects/all?page=${page}&size=${size}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Get paginated data
            const projectData = res.data.content ? res.data.content : res.data;

            // Filter only active projects
            const activeProjects = projectData.filter((p) => p.active !== false);

            // Sort by updatedAt (latest to oldest)
            const sortedProjects = activeProjects.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            setProjects(sortedProjects);

            if (res.data.totalPages !== undefined) {
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error('Fetch projects error:', error.response || error.message || error);
            alert('Failed to fetch projects');
        }
    };

    

    const loadEmployeeOptions = async (inputValue) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${BASE_URL}/admin/employees/employees?search=${inputValue}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newEmployees = res.data.filter(
                (newEmp) => !employeeOptions.some((existing) => existing.id === newEmp.id)
            );

            if (newEmployees.length > 0) {
                setEmployeeOptions((prev) => [...prev, ...newEmployees]);
            }

            return res.data.map(emp => ({
                label: `${emp.name} (${emp.empId})`,
                value: emp.empId
            }));
        } catch (error) {
            console.error('Failed to load employee options:', error);
            return [];
        }
    };

    const toggleExpand = (projectId) => {
        setExpandedCards((prev) => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };
    
    const isLongDescription = (text) => {
        if (!text) return false; // safely handle null, undefined, or empty strings
        return text.split(' ').length > 15;
    };
    
    const hasManyEmployees = (project) => {
        return project.assignedEmployeeIds && project.assignedEmployeeIds.length > 3;
    };
    
    

    const handleAssignChange = (projectId, empId) => {
        setAssigningEmpId((prev) => ({ ...prev, [projectId]: empId }));
    };

    const handleAssignSubmit = async (projectId) => {
        const empId = assigningEmpId[projectId];
        const token = localStorage.getItem('token');

        if (!empId) {
            setEmpIdError((prev) => ({ ...prev, [projectId]: 'Please select an employee.' }));
            return;
        }

        try {
            await axios.post(
                `${BASE_URL}/admin/projects/${projectId}/assign/${empId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmpIdError((prev) => ({ ...prev, [projectId]: '' }));
            setAssigningEmpId((prev) => ({ ...prev, [projectId]: '' }));
            fetchProjects();
        } catch (err) {
            alert('Failed to assign employee');
        }
    };

    const handleRemoveEmployee = async (projectId, employeeId) => {
        if (!window.confirm('Do you want to remove this Employee ?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${BASE_URL}/admin/projects/${projectId}/remove/${employeeId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Employee Removed Succussfully');
            fetchProjects(); // Refresh the project list
        } catch (err) {
            alert('Failed to remove employee');
        }
    };

    const openCreateModal = () => {
        setEditMode(false);
        setFormData({ id: '', name: '', description: '', status: '', startDate: '', endDate: '' });
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setEditMode(true);
        setFormData({
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        let projectId = formData.id;

        try {
            // First: create or update project
            if (editMode) {
                await axios.put(
                    `${BASE_URL}/admin/projects/update/${projectId}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                const response = await axios.post(
                    `${BASE_URL}/admin/projects/create`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                projectId = response.data.id;
            }

            // Second: Upload file if selected
            if (selectedFiles.length > 0 && projectId) {
                const formData = new FormData();
                selectedFiles.forEach(file => {
                    formData.append("files", file);
                });

                await axios.post(
                    `${BASE_URL}/admin/projects/projects/${projectId}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }


            setShowModal(false);
            setSelectedFiles(null);
            fetchProjects();
        } catch (error) {
            alert('Error saving project');
        }
    };

    const handleDeleteFile = async (projectId, filePath) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${BASE_URL}/admin/projects/projects/${projectId}/file`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { filePath },
            });
            fetchProjects(); // refresh UI
        } catch (err) {
            alert('Failed to delete file');
        }
    };



    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${BASE_URL}/admin/projects/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProjects();
        } catch {
            alert('Failed to delete project');
        }
    };

    const filteredProjects = projects.filter(project => {
        const fieldValue = project[searchField];
        return fieldValue?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleFileDownload = async (projectId, fileName) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Do you want to Download this File ?')) return;
        try {
            
            const response = await axios.get(
                `${BASE_URL}/admin/projects/projects/${projectId}/files/${encodeURIComponent(fileName)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob', // ✅ Important: get binary data
                }
            );

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };
    

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchProjects(pageNumber - 1); // Backend page index is 0-based
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        style={{ padding: '6px' }}
                    >
                        <option value="name">Name</option>
                        <option value="status">Status</option>
                    </select>

                    <input
                        type="text"
                        placeholder={`Search by ${searchField}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '250px' }}
                    />
                </div>

                <h2>All Projects</h2>
                <button style={styles.createBtn} onClick={openCreateModal}>Create Project</button>
            </div>

            <div style={styles.cardGrid}>
            
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        style={{
                            ...styles.card,
                            height: expandedCards[project.id] ? 'auto' : '290px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                >
                        <h3>{project.name}</h3>
                        <div>
                            <strong>Description:</strong>{' '}
                            {project.description && isLongDescription(project.description) ? (

                                <>
                                    <span>
                                        {project.description.slice(0, 55)}...
                                        <button
                                            onClick={() => setExpandedProject(project)}
                                            style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '5px' }}
                                        >
                                            Read more
                                        </button>
                                    </span>
                                </>
                            ) : (
                                <span>{project.description}</span>
                            )}
                        </div>

                        <p><strong>Status:</strong> {project.status}</p>
                        <p><strong>Start Date:</strong> {project.startDate}</p>
                        <p><strong>End Date:</strong> {project.endDate}</p>

                        <div style={{ marginTop: '10px' }}>
                            <strong>Files:</strong>
                            {project.filePaths && project.filePaths.length > 0 && (
                                <>
                                    <ul>
                                        {(project.filePaths.length > 3
                                            ? project.filePaths.slice(0, 3)
                                            : project.filePaths
                                        ).map((path, index) => {
                                            const normalizedPath = path.replace(/\\/g, '/');
                                            const fullFileName = normalizedPath.split('/').pop();
                                            const displayName = fullFileName.substring(fullFileName.indexOf('_') + 1);
                                            const truncatedDisplayName =
                                                displayName.length > 15 ? displayName.substring(0, 12) + '...' : displayName;

                                            return (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => handleFileDownload(project.id, fullFileName)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'blue',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            padding: 0,
                                                            marginRight: '10px'
                                                        }}
                                                        title={displayName}
                                                    >
                                                        {truncatedDisplayName}
                                                    </button>

                                                    <button
                                                        style={styles.removeButton}
                                                        onClick={() => handleDeleteFile(project.id, path)}
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {project.filePaths.length > 3 && (
                                        <button
                                            onClick={() => setViewAllFilesProject(project)}
                                            style={{ ...styles.editButton, marginTop: '6px' }}
                                        >
                                            View All Files
                                        </button>
                                    )}
                                </>
                            )}

                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <strong>Employees:</strong>
                            {project.assignedEmployeeIds && project.assignedEmployeeIds.length > 0 ? (
                                <>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {(hasManyEmployees(project)
                                            ? project.assignedEmployeeIds.slice(0, 3)
                                            : project.assignedEmployeeIds
                                        ).map(id => {
                                            const emp = employeeOptions.find(e => e.id === id);
                                            const displayText = emp ? `${emp.name} (${emp.empId})` : id;
                                            return (
                                                <li key={id} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', }}>
                                                    <span>{displayText}</span>
                                                    <button
                                                        onClick={() => handleRemoveEmployee(project.id, id)}
                                                        style={styles.removeButton}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {hasManyEmployees(project) && (
                                        <button
                                            onClick={() => setViewAllEmployeesProject(project)}
                                            style={{ ...styles.editButton, marginTop: '6px', }}
                                        >
                                            View All Employees
                                        </button>
                                    )}
                                </>
                            ) : <p>None</p>}
                        </div>


                        <div style={{ marginTop: '10px' }}>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadEmployeeOptions}
                                defaultOptions={false}
                                menuPortalTarget={document.body} // ⬅️ This renders the menu in the document body
                                menuPosition="fixed"             // ⬅️ Positions it properly on screen
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }) // Ensure it's on top
                                }}
                                value={
                                    assigningEmpId[project.id]
                                        ? {
                                            label: (() => {
                                                const emp = employeeOptions.find(e => e.empId === assigningEmpId[project.id]);
                                                return emp ? `${emp.name} (${emp.empId})` : 'Unknown';
                                            })(),
                                            value: assigningEmpId[project.id]
                                        }
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    handleAssignChange(project.id, selectedOption ? selectedOption.value : '')
                                }
                                placeholder="Search & select employee..."
                                isClearable
                            />
                            <button onClick={() => handleAssignSubmit(project.id)} style={styles.assignButton}>
                                Assign
                            </button>
                            {empIdError[project.id] && (
                                <div style={styles.error}>{empIdError[project.id]}</div>
                            )}
                        </div>
                        <button
                            onClick={() => toggleExpand(project.id)}
                            style={{
                                ...styles.editButton,
                                marginTop: '10px',
                                position: 'absolute',
                                bottom: '16px',
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {expandedCards[project.id] ? 'Hide Details' : 'Show Details'}
                        </button>
                        <div style={styles.cardActions}>
                            <button onClick={() => openEditModal(project)} style={styles.editButton}>Edit</button>
                            <button onClick={() => handleDelete(project.id)} style={styles.deleteButton}>Delete</button>
                        </div>
                        
                        
                        
                    </div>

                    
                ))}
                
            </div>


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

            {showModal && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupCard}>
                        <div style={styles.popupHeader}>
                            <h3>{editMode ? 'Edit Project' : 'Create Project'}</h3>
                            <button onClick={() => setShowModal(false)} style={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <strong> Name:</strong>
                            <input
                                type="text"
                                name="name"
                                placeholder="Project Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <strong> Project Description:</strong>
                            <textarea
                                name="description"
                                placeholder="Project Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                style={styles.input}
                                rows="3"
                            />
                            <strong> Status:</strong>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <strong> Start Date:</strong>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            <strong> End Date:</strong>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                                style={styles.input}
                            />


                            <div style={{ textAlign: 'right' }}>
                                <button type="submit" style={styles.saveButton}>
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {viewAllEmployeesProject && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupCard}>
                        <div style={styles.popupHeader}>
                            <h3>All Assigned Employees</h3>
                            <button onClick={() => setViewAllEmployeesProject(null)} style={styles.closeButton}>×</button>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {viewAllEmployeesProject.assignedEmployeeIds.map(id => {
                                const emp = employeeOptions.find(e => e.id === id);
                                const displayText = emp ? `${emp.name} (${emp.empId})` : id;
                                return (
                                    <li key={id} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                                        <span>{displayText}</span>
                                        <button
                                            onClick={() => handleRemoveEmployee(viewAllEmployeesProject.id, id)}
                                            style={styles.removeButton}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}


            {viewAllFilesProject && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupCard}>
                        <div style={styles.popupHeader}>
                            <h3>{viewAllFilesProject.name} - All Files</h3>
                            <button onClick={() => setViewAllFilesProject(null)} style={styles.closeButton}>&times;</button>
                            </div>
                        <ul>
                            {viewAllFilesProject.filePaths.map((path, index) => {
                                const normalizedPath = path.replace(/\\/g, '/');
                                const fullFileName = normalizedPath.split('/').pop();
                                const displayName = fullFileName.substring(fullFileName.indexOf('_') + 1);
                                return (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleFileDownload(viewAllFilesProject.id, fullFileName)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'blue',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                padding: 0,
                                                marginRight: '10px'
                                            }}
                                            title={displayName}
                                        >
                                            {displayName}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
            
            {expandedProject && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupCard}>
                        <div style={styles.popupHeader}>
                            <h2>{expandedProject.name}</h2>
                            <button onClick={() => setExpandedProject(null)} style={styles.closeButton}>&times;</button>
                        </div>
                        <p><strong>Description:</strong> {expandedProject.description}</p>
                        <p><strong>Status:</strong> {expandedProject.status}</p>
                        <p><strong>Start Date:</strong> {expandedProject.startDate}</p>
                        <p><strong>End Date:</strong> {expandedProject.endDate}</p>

                        <div style={{ marginTop: '10px' }}>
                            <strong>Employees:</strong>
                            {expandedProject.assignedEmployeeIds && expandedProject.assignedEmployeeIds.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {expandedProject.assignedEmployeeIds.map(id => {
                                        const emp = employeeOptions.find(e => e.id === id);
                                        const displayText = emp ? `${emp.name} (${emp.empId})` : id;
                                        return (
                                            <li key={id} style={{ marginBottom: '4px' }}>
                                                {displayText}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : <p>None</p>}
                        </div>
                    </div>
                </div>
                
            )}


        </div>
    );
};

export default ProjectList;

const styles = {
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '10px 10px 10px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    popupCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.6)',
    },
    popupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    saveButton: {
        padding: '10px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    container: {
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    createBtn: {
        padding: '10px 20px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
        gap: '20px',
        
    },
    card: {
        border: '1px solid #ddd',
        height: 'auto',
        borderRadius: '10px',
        padding: '16px',
        backgroundColor: '#f9f9f9',
        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column', // Make it a column flex container
    },
    removeButton: {
        marginLeft: '8px',
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '2px 6px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    assignButton: {
        padding: '4px 8px',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        marginTop: '6px',
        cursor: 'pointer',
    },
    cardActions: {
        marginTop: 'auto', // Push to bottom
        display: 'flex',
        gap: '10px',
        justifyContent: 'right', // Center align buttons
    },
    editButton: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    
    error: {
        color: 'red',
        fontSize: '12px',
        marginTop: '4px'
    },
    pagination: {
        marginTop: '15px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
    }
};


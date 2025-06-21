import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api'

const EmployeeProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [expandedProject, setExpandedProject] = useState(null);
    const [viewAllFilesProject, setViewAllFilesProject] = useState(null);


    const empId = localStorage.getItem('empId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/projects/employee/${empId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                setProjects(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch projects. Please try again.');
                setLoading(false);
            });
    }, [empId, token]);

    const isLongDescription = (text) => {
        if (!text) return false; // safely handle null, undefined, or empty strings
        return text.split(' ').length > 25;
    };


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

    if (loading) return <p style={{ textAlign: 'center' }}>Loading projects...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My Projects</h2>
            {projects.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No projects assigned.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {projects.map((project, index) => (
                        <li key={project.id || index} style={{
                            background: '#f9f9f9',
                            marginBottom: '15px',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            <h3>{project.name}</h3>
                            <div>
                                <strong>Description:</strong>{' '}
                                {project.description && expandedProject?.id === project.id ? (
                                    <>
                                        <span>{project.description}</span>
                                        <button
                                            onClick={() => setExpandedProject(null)}
                                            style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '5px' }}
                                        >
                                            Show less
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            {project.description.slice(0, 75)}...
                                            <button
                                                onClick={() => setExpandedProject(project)}
                                                style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '5px' }}
                                            >
                                                Read more
                                            </button>
                                        </span>
                                    </>
                                )}

                            </div>

                            <p><strong>Status:</strong> {project.status}</p>
                            <p><strong>Start Date:</strong> {project.startDate}</p>
                            <p><strong>End Date:</strong> {project.endDate}</p>

                            <div style={{ marginTop: '10px' }}>
                                <strong>Files:</strong>{' '}
                                {viewAllFilesProject?.id === project.id ? (
                                    <>
                                        <ul>
                                            {project.filePaths.map((path, index) => {
                                                const normalizedPath = path.replace(/\\/g, '/');
                                                const fullFileName = normalizedPath.split('/').pop();
                                                const displayName = fullFileName.substring(fullFileName.indexOf('_') + 1);
                                                const truncatedDisplayName = displayName.length > 15 ? displayName.substring(0, 12) + '...' : displayName;

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
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <button
                                            onClick={() => setViewAllFilesProject(null)}
                                            style={{ ...styles.editButton, marginTop: '6px' }}
                                        >
                                            Hide Files
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setViewAllFilesProject(project)}
                                        style={{ ...styles.editButton, marginTop: '6px' }}
                                    >
                                        View Files
                                    </button>
                                )}
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    editButton: {
        backgroundColor: '#e0e0e0',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginRight: '8px',
    },
    removeButton: {
        backgroundColor: '#ff4d4f',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#fff',
    }
};


export default EmployeeProjects;

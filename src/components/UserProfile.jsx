import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api'

const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
};

const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block',
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: '#fff',
};

const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
    marginLeft: '10px',
};

const containerStyle = {
    padding: '30px',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const UserProfile = () => {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const id = localStorage.getItem('id');

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
 

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${BASE_URL}/admin/employees/${id}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                setEmployee(res.data);
                setFormData(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Employee not found or server error.');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(`${BASE_URL}/admin/employees/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setEmployee(res.data);
            setIsEditing(false);
        } catch (err) {
            setError('Update failed. Please try again.');
        }
    };

    const handleUploadProfilePic = async () => {
        if (!selectedFile) return;

        const token = localStorage.getItem('token');
        const empId = localStorage.getItem('empId');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await axios.post(
                `${BASE_URL}/admin/employees/${empId}/upload-profile-pic`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setUploadSuccess(res.data);
            setUploadError('');
            setSelectedFile(null);

            // Optionally, refresh employee data to show updated profile pic
            const updatedEmployee = await axios.get(`${BASE_URL}/admin/employees/${id}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployee(updatedEmployee.data);

        } catch (err) {
            setUploadError('Failed to upload profile picture. Please try again.');
            setUploadSuccess('');
        }
    };
    

    if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Employee Profile</h2>

            {isEditing ? (
                <div>
                    <label style={labelStyle}>Name:</label>
                    <input style={inputStyle} type="text" name="name" value={formData.name || ''} onChange={handleChange} />

                    <label style={labelStyle}>Email:</label>
                    <input style={inputStyle} type="email" name="email" value={formData.email || ''} onChange={handleChange} />

                    <label style={labelStyle}>Designation:</label>
                    <input style={inputStyle} type="text" name="designation" value={formData.designation || ''} onChange={handleChange} />

                    <label style={labelStyle}>Department:</label>
                    <input style={inputStyle} type="text" name="department" value={formData.department || ''} onChange={handleChange} />

                    <label style={labelStyle}>Skills:</label>
                    <input style={inputStyle} type="text" name="skills" value={formData.skills || ''} onChange={handleChange} />

                    <div style={{ marginTop: '20px' }}>
                        <button style={buttonStyle} onClick={handleUpdate}>Save</button>
                        <button style={cancelButtonStyle} onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                    <div style={{ lineHeight: '2' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Profile Picture:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setSelectedFile(e.target.files[0]);
                                    setUploadError('');
                                    setUploadSuccess('');
                                }}
                            />
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                {selectedFile ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                ) : employee.profilePic ? (
                                    <img
                                        src={`http://localhost:8080/uploads/${employee.profilePic}`}
                                        alt="Profile"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                ) : (
                                    <p>No profile picture uploaded.</p>
                                )}
                            </div>

                            <button
                                style={{ ...buttonStyle, marginTop: '10px' }}
                                onClick={handleUploadProfilePic}
                                disabled={!selectedFile}
                            >
                                Upload Profile Picture
                            </button>
                            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                            {uploadSuccess && <p style={{ color: 'green' }}>{uploadSuccess}</p>}
                        </div>

                    <p><strong>EmpID:</strong> {employee.empId}</p>
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Role:</strong> {employee.role}</p>
                    <p><strong>Designation:</strong> {employee.designation}</p>
                    <p><strong>Department:</strong> {employee.department}</p>
                    <p><strong>Skills:</strong> {employee.skills}</p>

                    <button style={buttonStyle} onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;

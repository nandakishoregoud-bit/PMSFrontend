import React, { useState } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api';

const SubmitReportForm = () => {
    const [title, setTitle] = useState('');
    const [reportContent, setReportContent] = useState('');
    const [hoursSpend, setHoursSpend] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [searchInput, setSearchInput] = useState("");
    const [searchError, setSearchError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]); // only 1 will be allowed for submitTo

    const handleSearchEmployee = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}/admin/employees/employees?search=${searchInput}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const matches = res.data;

            if (!matches.length) {
                setSearchResults([]);
                setSearchError("No matching employees found.");
                return;
            }

            setSearchResults(matches);
            setSearchError("");
        } catch (error) {
            console.error("Search failed", error);
            setSearchError("Error searching employee");
        }
    };

    const handleAddEmployee = (employee) => {
        setAssignedEmployees([employee]); // Only one submitTo allowed
        setSearchInput("");
        setSearchResults([]);
    };

    const handleRemoveEmployee = () => {
        setAssignedEmployees([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (assignedEmployees.length === 0) {
            setError("Please select a valid employee to submit to.");
            return;
        }

        const report = {
            employeeId: localStorage.getItem('empId'),
            title,
            reportContent,
            submittedDate: new Date().toISOString(),
            hoursSpend,
            submitTo: assignedEmployees[0].empId,
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/admin/employees/submitReport`, report, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess('Report submitted successfully!');
            setTitle('');
            setReportContent('');
            setHoursSpend('');
            setAssignedEmployees([]);
        } catch (err) {
            console.error(err);
            setError('Failed to submit report. Please try again. Ensure employee is approved.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Submit Daily Report</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Title</label>
                    <input
                        type="text"
                        value={title}
                        placeholder="Project Name or Daily Report"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Report Content</label>
                    <textarea
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        required
                        rows="6"
                        style={styles.textarea}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Hours Spend</label>
                    <input
                        value={hoursSpend}
                        placeholder="Provided in Hours"
                        onChange={(e) => setHoursSpend(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Select Employee by ID or Name</label>
                    <input
                        placeholder="Enter Employee ID or Name"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={styles.input}
                    />
                    <button type="button" onClick={handleSearchEmployee} style={{ marginTop: "10px" }}>
                        Search
                    </button>

                    {searchError && <p style={{ color: "red" }}>{searchError}</p>}

                    {searchResults.length > 0 && (
                        <div>
                            <h4>Search Results:</h4>
                            <ul>
                                {searchResults.map((emp) => (
                                    <li key={emp.empId}>
                                        <strong>{emp.empId}</strong> - {emp.name}
                                        <button onClick={() => handleAddEmployee(emp)} style={{ marginLeft: "10px" }}>
                                            Add
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {assignedEmployees.length > 0 && (
                        <div>
                            <h4>Selected Employee to Submit To:</h4>
                            <ul>
                                {assignedEmployees.map((emp) => (
                                    <li key={emp.empId}>
                                        <strong>{emp.empId}</strong> - {emp.name}
                                        <button onClick={handleRemoveEmployee} style={{ marginLeft: "10px" }}>
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button type="submit" style={styles.button}>
                    Submit Report
                </button>
            </form>

            {success && <p style={styles.success}>{success}</p>}
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#f4f7f8',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    heading: {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#333'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#444'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    button: {
        backgroundColor: '#4caf50',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease'
    },
    success: {
        color: 'green',
        marginTop: '20px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    error: {
        color: 'red',
        marginTop: '20px',
        fontWeight: 'bold',
        textAlign: 'center'
    }
};

export default SubmitReportForm;

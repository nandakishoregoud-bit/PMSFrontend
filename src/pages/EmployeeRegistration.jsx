import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeRegistration = () => {

    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        name: '',
        empId: '',
        email: '',
        designation: '',
        department: '',
        skills: '',
        active: false,
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployee((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/employees/employee', employee);
            setMessage('Employee registered successfully!');
            setEmployee({
                name: '',
                empId: '',
                email: '',
                designation: '',
                department: '',
                skills: '',
                active: false,
                password: ''
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            setMessage('Failed to register employee');
        }
    };

    return (

        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2>Employee Registration</h2>

                <input style={styles.input} type="text" name="name" placeholder="Name" value={employee.name} onChange={handleChange} required />
                <input style={styles.input} type="text" name="empId" placeholder="Employee ID" value={employee.empId} onChange={handleChange} required />
                <input style={styles.input} type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange} required />
                <input style={styles.input} type="text" name="designation" placeholder="Designation" value={employee.designation} onChange={handleChange} required />
                <input style={styles.input} type="text" name="department" placeholder="Department" value={employee.department} onChange={handleChange} required />
                <input style={styles.input} type="text" name="skills" placeholder="Skills" value={employee.skills} onChange={handleChange} required />
                <div style={styles.passwordWrapper}>
                    <input
                        style={styles.input}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={employee.password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        style={styles.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                <button type="submit" style={styles.button}>Register</button>
                <p>Already has Account?<a href='/'>login</a></p>
                <p>Forgot Password?<a href='/password'>forgotpassword</a></p>
            </form>
        </div>
        
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    form: {
        padding: '30px',
        flexDirection: 'column',
        backgroundColor: '#ffff',
        boxShadow: '10px 10px 10px rgba(0,0,0.6,0.6)',
        gap: '12px',
        width: '500px',
        textAlign: 'center',
        borderRadius: '16px',
    },
    input: {
        marginBottom: '18px',
        width: '80%',
        padding: '10px',
        fontSize: '18px',
    },
    button: {
        width: '80%',
        padding: '10px',
        backgroundColor: '#007bff',
        
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    message: {
        fontWeight: 'bold',
        color: 'green'
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%', // match the input width
        marginBottom: '18px', // same spacing as other inputs
        alignSelf: 'center',
    }
,    
    eyeIcon: {
        position: 'absolute',
        
        right: '60px',
        top: '35%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#888',
        userSelect: 'none',
    }
};

export default EmployeeRegistration;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BASE_URL = 'http://localhost:8080/api';

const LoginPage = () => {
    const navigate = useNavigate();

    const [empId, setempId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 👈 New state
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/auth/employees/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ empId, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('id', data.id);
                localStorage.setItem('empId', data.empId);

                if (data.role === "Admin") {
                    navigate('/dashboard');
                } else if (data.role === "Manager") {
                    navigate('/Managerdashboard');
                } else {
                    navigate('/dash');
                }
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again later.');
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleLogin}>
                <h2>Login</h2>

                <input
                    style={styles.input}
                    type="text"
                    placeholder="empId"
                    value={empId}
                    onChange={(e) => setempId(e.target.value)}
                    required
                />

                <div style={styles.passwordWrapper}>
                    <input
                        style={styles.input}
                        type={showPassword ? "text" : "password"} // 👈 toggle type
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        style={styles.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                <button style={styles.button} type="submit">Login</button>

                {error && <p style={styles.error}>{error}</p>}

                <p>If you're not registered? <a href='/register'>Register</a></p>
                <p>Forgot Password? <a href='/password'>Reset here</a></p>
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
        borderRadius: '16px',
        backgroundColor: '#fff',
        boxShadow: '10px 10px 10px rgba(0,0,0.6,0.6)',
        height: '360px',
        width: '500px',
        textAlign: 'center',
    },
    input: {
        marginBottom: '15px',
        width: '75%',
        padding: '10px',
        fontSize: '18px',
        border: '1px solid #ccc',
        borderRadius: '6px',
    },
    button: {
        width: '80%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
    },
    error: {
        marginTop: '10px',
        color: 'red',
        fontSize: '14px',
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

export default LoginPage;

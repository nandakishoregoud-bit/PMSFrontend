import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const sendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/employees/password', null, {
                params: { email }
            });
            setMessage(response.data);
            setOtpSent(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    const verifyOtpAndUpdatePassword = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/employees/verify-otp', null, {
                params: {
                    email,
                    otp,
                    newPassword
                }
            });
            setMessage(response.data);
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.form}>
                <a href='/'>login</a>
                <h2 style={styles.title}>Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                
                {!otpSent ? (
                    <button onClick={sendOtp} style={styles.button}>Send OTP</button>
                    
                ) :
                    (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={verifyOtpAndUpdatePassword} style={styles.button}>
                            Reset Password
                        </button>
                    </>
                )}
                {message && <p style={styles.message}>{message}</p>}
            </div>
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
        backgroundColor: '#fff',
        padding: '30px 40px',
        borderRadius: '12px',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '15px',
        outline: 'none',
        transition: 'border 0.3s',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    message: {
        marginTop: '15px',
        color: 'green',
        fontSize: '14px',
    },
};

export default ForgotPassword;

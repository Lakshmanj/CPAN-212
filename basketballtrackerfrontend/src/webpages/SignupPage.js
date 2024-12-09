import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [userCount, setUserCount] = useState(0);
    const [currentDate, setCurrentDate] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users');
                setUserCount(response.data.length); // Update with actual response field if necessary
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        fetchUserCount();

        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-US', options));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password length validation
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Check if passwords match
        if (formData.password === formData.confirmPassword) {
            try {
                const response = await axios.post('http://localhost:8000/api/users/signup', formData);
                console.log('Account created:', response.data);
                setSuccessMessage('Account created successfully! You can now log in.');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                navigate('/'); // Redirect to login page
            } catch (error) {
                console.error('Error creating account:', error);
                setErrorMessage('Error creating account. Please try again.');
            }
        } else {
            alert('Passwords do not match');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.topBar}>
                <div style={styles.dateText}>{currentDate}</div>
                <div style={styles.userCount}>Users logged in: {userCount}</div>
            </div>
            <h1 style={styles.title}>Sign Up</h1>

            {successMessage && (
                <div style={styles.successMessage}>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div style={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}

            <div style={styles.formContainer}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <input
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type="password"
                            placeholder="Confirm Password"
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.submitButton}>Sign Up</button>
                    <button type="button" onClick={handleGoBack} style={styles.goBackButton}>Already Got an Account? Log in</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'teal',
        padding: '20px',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 20px',
        position: 'absolute',
        top: '20px',
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: '20px',
        position: 'absolute',
        left: '50px',
        top: '20px',
    },
    userCount: {
        fontWeight: 'bold',
        fontSize: '20px',
        position: 'absolute',
        right: '50px',
        top: '20px',
    },
    title: {
        fontWeight: 'bold',
        fontSize: '35px',
        marginTop: '60px',
        color: 'white',
    },
    successMessage: {
        color: 'green',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    errorMessage: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
    },
    form: {
        backgroundColor: 'lightgray',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    },
    inputGroup: {
        marginBottom: '10px',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    submitButton: {
        padding: '10px',
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    goBackButton: {
        padding: '10px',
        width: '100%',
        backgroundColor: '#555',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default SignupPage;

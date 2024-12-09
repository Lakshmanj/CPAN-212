import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const [userCount, setUserCount] = useState(0);
    const [currentDate, setCurrentDate] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users');
                setUserCount(response.data.length);
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        fetchUserCount();

        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-US', options));
    }, []);

    const handleLoginClick = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', {
                email: username,
                password: password,
            });
            console.log('Login successful:', response.data);

            
            localStorage.setItem('token', response.data.token);

            
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data.error) {
                if (error.response.data.error === 'User not found') {
                    setErrorMessage('User not found. Please try again.');
                } else if (error.response.data.error === 'Invalid email or password') {
                    setErrorMessage('Incorrect password. Please try again.');
                } else {
                    setErrorMessage('Login failed. Please try again.');
                }
            } else {
                setErrorMessage('Login failed. Please try again.');
            }
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.topBar}>
                <div style={styles.dateText}>{currentDate}</div>
                <div style={styles.userCount}>Users logged in: {userCount}</div>
            </div>
            <h1 style={styles.title}>Basketball Score Tracker</h1>
            <div style={styles.formContainer}>
                <div style={styles.loginForm}>
                    <h3>Log In</h3>
                    <div style={styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            type="text"
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: '10px', color: 'red' }}>
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <button style={styles.loginButton} onClick={handleLoginClick}>Log In</button>
                    </div>
                </div>
                <div style={styles.signUpForm}>
                    <p>Don't have an account? Sign up!</p>
                    <button style={styles.signUpButton} onClick={handleSignUpClick}>
                        Make an Account
                    </button>
                </div>
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
        position: 'relative',
        paddingTop: '40px',
        backgroundColor: 'teal'
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
        marginTop: '20px',
        textAlign: 'center',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        gap: '20px',
    },
    loginForm: {
        backgroundColor: 'lightgray',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    },
    signUpForm: {
        backgroundColor: 'darkgray',
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
        width: '90%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    loginButton: {
        marginTop: '10px',
        padding: '10px',
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    signUpButton: {
        padding: '10px',
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default WelcomePage;

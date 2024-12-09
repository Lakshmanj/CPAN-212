import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountSettingsPage = () => {
    const [preferences, setPreferences] = useState({
        favoriteTeam: '',
        league: '',
        season: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, 
                    },
                });

                
                setPreferences({
                    favoriteTeam: response.data.favoriteTeam || '',
                    league: response.data.league || '',
                    season: response.data.season || '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error.response?.data || error.message);
                setSuccessMessage('Error fetching preferences.');
            }
        };

        fetchUserData();
    }, []);

    
    const handlePreferencesChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    
    const handlePreferencesSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                'http://localhost:8000/api/users/me/preferences',
                preferences,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                setSuccessMessage('Preferences updated successfully!');
            }
        } catch (error) {
            console.error('Error updating preferences:', error.response?.data || error.message);
            setSuccessMessage('Error updating preferences. Please try again.');
        }
    };

    
    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <div style={styles.pageContainer}>
            <form onSubmit={handlePreferencesSubmit} style={styles.form}>
                <h2 style={styles.title}>Preferences</h2>
                
                
                <input
                    name="favoriteTeam"
                    value={preferences.favoriteTeam}
                    onChange={handlePreferencesChange}
                    placeholder="Favorite Team"
                    style={styles.input}
                />

                
                <input
                    name="league"
                    value={preferences.league}
                    onChange={handlePreferencesChange}
                    placeholder="League"
                    style={styles.input}
                />

                
                <input
                    name="season"
                    value={preferences.season}
                    onChange={handlePreferencesChange}
                    placeholder="Season"
                    style={styles.input}
                />

                <button type="submit" style={styles.submitButton}>Save Preferences</button>
                {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
            </form>

            <button style={styles.goBackButton} onClick={handleGoBack}>Go Back</button>
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
    form: {
        backgroundColor: 'lightgray',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'black',
        marginBottom: '20px',
    },
    input: {
        width: '95%',
        padding: '8px',
        marginBottom: '10px',
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
    },
    successMessage: {
        marginTop: '10px',
        color: 'green',
        fontWeight: 'bold',
    },
    goBackButton: {
        padding: '10px',
        width: '150px',
        backgroundColor: '#555',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default AccountSettingsPage;

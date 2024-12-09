import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HomePage = ({ username }) => {
    const navigate = useNavigate();
    const [scores, setScores] = useState([]);
    const [preferences, setPreferences] = useState({});
    const [formData, setFormData] = useState({
        league: '',
        season: '',
        team: '',
        date: null,
    });

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPreferences(response.data);
                setFormData({
                    league: response.data.league || '',
                    season: response.data.season || '',
                    team: response.data.favoriteTeam || '',
                    date: null,
                });
            } catch (error) {
                console.error('Error fetching user preferences:', error);
            }
        };

        fetchPreferences();
    }, []);

    const handleSearch = async () => {
        try {
            const formattedDate = formData.date ? formData.date.toISOString().split('T')[0] : '';
            const response = await axios.get('http://localhost:8000/api/scores', {
                params: {
                    league: formData.league || 1,
                    season: formData.season || '2024-2025',
                    team: formData.team || '',
                    date: formattedDate,
                },
            });

            const games = response.data || [];
            setScores(games);

        } catch (error) {
            console.error('Error fetching scores:', error);
            setScores([]);
            alert('Failed to fetch scores. Please check your input and try again.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            date: date,
        }));
    };

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    const handleLogOutClick = () => {
        navigate('/');
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.title}>Basketball Score Tracker</h1>
            <h2 style={styles.welcomeMessage}>Welcome, let's play ball!</h2>
            <h3 style={styles.favoriteTeamMessage}>Go Team #{preferences.favoriteTeam}!</h3>
            <p style={styles.leagueMessage}>You're following league {preferences.league} for the {preferences.season} season.</p>

            <div style={styles.searchContainer}>
                <form style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>League:</label>
                        <input
                            type="text"
                            name="league"
                            value={formData.league}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter league"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Season:</label>
                        <input
                            type="text"
                            name="season"
                            value={formData.season}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter season"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Team ID:</label>
                        <input
                            type="number"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter team ID"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Date:</label>
                        <DatePicker
                            selected={formData.date}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Select a date"
                            customInput={<input style={styles.input} />}
                        />
                    </div>
                    <button
                        type="button"
                        style={styles.searchButton}
                        onClick={handleSearch}
                    >
                        Play Ball!
                    </button>
                </form>
            </div>

            {scores && (
                <div style={styles.resultsContainer}>
                    <h3>Search Results</h3>
                    <ul>
                        {scores.map((game) => (
                            <li key={game.id}>
                                {game?.teams?.home?.name || 'Unknown'} vs {game?.teams?.away?.name || 'Unknown'} -
                                {game?.scores?.home?.total || 0} : {game?.scores?.away?.total || 0}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button style={styles.settingsButton} onClick={handleSettingsClick}>
                Account Settings
            </button>
            <button style={styles.logOutButton} onClick={handleLogOutClick}>
                Log Out
            </button>
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
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'white',
    },
    welcomeMessage: {
        fontSize: '24px',
        fontWeight: 'normal',
        color: 'white',
        marginTop: '10px',
    },
    favoriteTeamMessage: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'yellow',
        marginTop: '10px',
    },
    leagueMessage: {
        fontSize: '18px',
        fontWeight: 'normal',
        color: 'white',
        marginTop: '10px',
    },
    searchContainer: {
        marginTop: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        width: '300px',
    },
    inputGroup: {
        marginBottom: '10px',
        width: '100%',
    },
    input: {
        padding: '8px',
        marginTop: '5px',
        width: '95%',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    searchButton: {
        padding: '10px',
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    resultsContainer: {
        marginTop: '20px',
        backgroundColor: 'lightgray',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        width: '300px',
    },
    settingsButton: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#555',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    logOutButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#555',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default HomePage;

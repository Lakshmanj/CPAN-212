import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Scores = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    const fetchScores = async () => {
        try {
            const response = await axios.get('/api/scores');
            setGames(response.data);
        } catch (err) {
            console.error('Error fetching scores:', err);
            setError('Failed to load live scores.');
        }
    };

    useEffect(() => {
        fetchScores();
    }, [fetchScores]); 

    return (
        <div>
            <h1>Live Basketball Scores</h1>
            {games.length === 0 ? (
                <p>No live games available at the moment.</p>
            ) : (
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            {game.teams.home.name} vs {game.teams.away.name} - {game.scores.home.total} : {game.scores.away.total}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Scores;
